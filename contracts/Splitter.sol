// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {SplitStorage} from "./SplitStorage.sol";
import {IRoyaltyVault} from "@chestrnft/royalty-vault/interfaces/IRoyaltyVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IWETH} from "../interfaces/IWETH.sol";

/**
 * @title Splitter
 * Building on the work from the Uniswap team at Uniswap and Mirror.xyz Team
 */
contract Splitter is SplitStorage {
    uint256 public constant PERCENTAGE_SCALE = 10e5;
    bytes4 public constant IID_IROYALTY = type(IRoyaltyVault).interfaceId;

    // The TransferETH event is emitted after each eth transfer in the split is attempted.
    event TransferETH(
        // The account to which the transfer was attempted.
        address account,
        // The amount for transfer that was attempted.
        uint256 amount,
        // Whether or not the transfer succeeded.
        bool success
    );

    // Emits when a window is incremented.
    event WindowIncremented(uint256 currentWindow, uint256 fundsAvailable);

    function claimForAllWindows(
        uint32 tokenId,
        uint256 percentageAllocation,
        bytes32[] calldata merkleProof
    ) external {
        // Make sure that the user has this allocation granted.
        require(
            verifyProof(
                merkleProof,
                merkleRoot,
                getNode(membershipContract, tokenId, percentageAllocation)
            ),
            "Invalid proof"
        );

        uint256 amount = 0;

        address tokenOwner = IERC721(membershipContract).ownerOf(tokenId);
        require(tokenOwner == msg.sender, "Invalid Membership");

        for (uint256 i = 0; i < currentWindow; i++) {
            if (!isClaimed(i, membershipContract, tokenId)) {
                setClaimed(i, membershipContract, tokenId);

                amount += scaleAmountByPercentage(
                    balanceForWindow[i],
                    percentageAllocation
                );
            }
        }

        transferSplitAsset(tokenOwner, amount);
    }

    function getNode(
        address membershipContract,
        uint32 tokenId,
        uint256 percentageAllocation
    ) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    membershipContract,
                    tokenId,
                    percentageAllocation
                )
            );
    }

    function scaleAmountByPercentage(uint256 amount, uint256 scaledPercent)
        public
        pure
        returns (uint256 scaledAmount)
    {
        /*
            Example:
                If there is 100 ETH in the account, and someone has 
                an allocation of 2%, we call this with 100 as the amount, and 200
                as the scaled percent.

                To find out the amount we use, for example: (100 * 200) / (100 * 100)
                which returns 2 -- i.e. 2% of the 100 ETH balance.
         */
        scaledAmount = (amount * scaledPercent) / (10000);
    }

    function claim(
        uint256 window,
        uint32 tokenId,
        uint256 scaledPercentageAllocation,
        bytes32[] calldata merkleProof
    ) external {
        require(currentWindow > window, "cannot claim for a future window");
        require(
            !isClaimed(window, membershipContract, tokenId),
            "NFT has already claimed the given window"
        );

        setClaimed(window, membershipContract, tokenId);

        require(
            verifyProof(
                merkleProof,
                merkleRoot,
                getNode(membershipContract, tokenId, scaledPercentageAllocation)
            ),
            "Invalid proof"
        );

        address tokenOwner = IERC721(membershipContract).ownerOf(tokenId);

        require(tokenOwner == msg.sender, "Invalid Membership");

        transferSplitAsset(
            tokenOwner,
            // The absolute amount that's claimable.
            scaleAmountByPercentage(
                balanceForWindow[window],
                scaledPercentageAllocation
            )
        );
    }

    function incrementWindow(uint256 royaltyAmount) public returns (bool) {
        uint256 wethBalance;

        require(
            IRoyaltyVault(msg.sender).supportsInterface(IID_IROYALTY),
            "Royalty Vault not supported"
        );
        require(
            IRoyaltyVault(msg.sender).getSplitter() == address(this),
            "Unauthorised to increment window"
        );

        wethBalance = IERC20(splitAsset).balanceOf(address(this));
        require(wethBalance >= royaltyAmount, "Insufficient funds");

        require(royaltyAmount > 0, "No additional funds for window");
        balanceForWindow.push(royaltyAmount);
        currentWindow += 1;
        emit WindowIncremented(currentWindow, royaltyAmount);
        return true;
    }

    function isClaimed(
        uint256 window,
        address membershipContract,
        uint32 tokenId
    ) public view returns (bool) {
        return claimed[getClaimHash(window, membershipContract, tokenId)];
    }

    //======== Private Functions ========

    function setClaimed(
        uint256 window,
        address membershipContract,
        uint32 tokenId
    ) private {
        claimed[getClaimHash(window, membershipContract, tokenId)] = true;
    }

    function getClaimHash(
        uint256 window,
        address membershipContract,
        uint32 tokenId
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(window, membershipContract, tokenId));
    }

    function amountFromPercent(uint256 amount, uint32 percent)
        private
        pure
        returns (uint256)
    {
        // Solidity 0.8.0 lets us do this without SafeMath.
        return (amount * percent) / 100;
    }

    // Will attempt to transfer ETH, but will transfer WETH instead if it fails.
    function transferSplitAsset(address to, uint256 value)
        private
        returns (bool didSucceed)
    {
        // Try to transfer ETH to the given recipient.
        didSucceed = IERC20(splitAsset).transfer(to, value);
        require(didSucceed, "Failed to transfer ETH");

        emit TransferETH(to, value, didSucceed);
    }

    function attemptETHTransfer(address to, uint256 value)
        private
        returns (bool)
    {
        // Here increase the gas limit a reasonable amount above the default, and try
        // to send ETH to the recipient.
        // NOTE: This might allow the recipient to attempt a limited reentrancy attack.
        (bool success, ) = to.call{value: value, gas: 30000}("");
        return success;
    }

    // From https://github.com/protofire/zeppelin-solidity/blob/master/contracts/MerkleProof.sol
    function verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) private pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        // Check if the computed hash (root) is equal to the provided root
        return computedHash == root;
    }
}
