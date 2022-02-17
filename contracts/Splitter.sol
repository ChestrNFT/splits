// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

import {SplitStorage} from "./SplitStorage.sol";
import {IRoyaltyVault} from "./IRoyaltyVault.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

interface IWETH {
    function deposit() external payable;

    function transfer(address to, uint256 value) external returns (bool);
}

/**
 * @title Splitter
 * @author MirrorXYZ
 *
 * Building on the work from the Uniswap team at https://github.com/Uniswap/merkle-distributor
 */
contract Splitter is SplitStorage {
    uint256 public constant PERCENTAGE_SCALE = 10e5;

    // The TransferETH event is emitted after each eth transfer in the split is attempted.
    event TransferETH(
        // The account to which the transfer was attempted.
        address account,
        // The amount for transfer that was attempted.
        uint256 amount,
        // Whether or not the transfer succeeded.
        bool success
    );

    bytes4 public constant IID_IROYALTY = type(IRoyaltyVault).interfaceId;

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
        require(tokenOwner==msg.sender,"Invalid Membership");
        
        for (uint256 i = 0; i < currentWindow; i++) {
            if (!isClaimed(i, membershipContract,tokenId)) {
                setClaimed(i, membershipContract,tokenId);

                amount += scaleAmountByPercentage(
                    balanceForWindow[i],
                    percentageAllocation
                );
            }
        }

        transferWETH(tokenOwner, amount);
    }

    function getNode(address membershipContract, uint32 tokenId, uint256 percentageAllocation)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(membershipContract, tokenId, percentageAllocation));
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
        scaledAmount = (amount * scaledPercent) / (100 * PERCENTAGE_SCALE);
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

        require(tokenOwner==msg.sender,"Invalid Membership");

        transferWETH(
            tokenOwner,
            // The absolute amount that's claimable.
            scaleAmountByPercentage(
                balanceForWindow[window],
                scaledPercentageAllocation
            )
        );
    }

    function incrementWindow(uint256 royaltyAmount) public {
        uint256 fundsAvailable;
        uint256 wethBalance;

        // require(IRoyaltyVault(msg.sender).supportsInterface(IID_IROYALTY),"Royalty Vault not supported");
        // require(IRoyaltyVault(msg.sender).splitter()==address(this),"Unauthorised to increment window");

        wethBalance = IERC20(wethAddress).balanceOf(address(this));
        fundsAvailable = royaltyAmount;
        
        require(wethBalance >= fundsAvailable, "Insufficient funds");
        
        require(fundsAvailable > 0, "No additional funds for window");
        balanceForWindow.push(fundsAvailable);
        currentWindow += 1;
        emit WindowIncremented(currentWindow, fundsAvailable);
    }

    function isClaimed(uint256 window, address membershipContract, uint32 tokenId)
        public
        view
        returns (bool)
    {
        return claimed[getClaimHash(window, membershipContract,tokenId)];
    }

    //======== Private Functions ========

    function setClaimed(uint256 window, address membershipContract, uint32 tokenId) private {
        claimed[getClaimHash(window, membershipContract, tokenId)] = true;
    }

    function getClaimHash(uint256 window, address membershipContract, uint32 tokenId)
        private
        pure
        returns (bytes32)
    {
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
    function transferWETH(address to, uint256 value)
        private
        returns (bool didSucceed)
    {
        // Try to transfer ETH to the given recipient.
        didSucceed = IWETH(wethAddress).transfer(to, value);
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
