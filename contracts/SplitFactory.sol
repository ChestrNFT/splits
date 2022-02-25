// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {SplitProxy} from "./SplitProxy.sol";
import {IRoyaltyVault} from "@chestrnft/royalty-vault/interfaces/IRoyaltyVault.sol";
import {ProxyVault} from "@chestrnft/royalty-vault/contracts/ProxyVault.sol";
import {ICoreCollection} from "../interfaces/ICoreCollection.sol";
import "hardhat/console.sol";

contract SplitFactory {
    /**** Immutable storage ****/

    address public immutable splitter;
    address public immutable royaltyVault;

    /**** Mmutable storage ****/
    // Gets set within the block, and then deleted.

    bytes32 public merkleRoot;
    address public splitAsset;
    address public royaltyAsset;
    address public splitterProxy;
    address public membershipContract;

    /**** Events ****/

    event SplitCreated(
        address indexed splitter,
        address indexed membershipContract
    );

    event VaultCreated(address indexed vault, address indexed splitter);

    event VaultAssignedToCollection(
        address indexed vault,
        address indexed splitter,
        address indexed collectionContract
    );

    /**
     * @dev Constructor
     * @param _splitter The address of the Splitter contract.
     */
    constructor(address _splitter, address _royaltyVault) {
        splitter = _splitter;
        royaltyVault = _royaltyVault;
    }

    /**
     * @dev Deploys a new SplitProxy with membershipContract.
     * @param _merkleRoot The merkle root of the asset.
     * @param _splitAsset The address of the asset to split.
     * @param _membershipContract The address of the membership contract.
     * @param _collectionContract The address of the collection contract.
     */
    function createSplit(
        bytes32 _merkleRoot,
        address _splitAsset,
        address _membershipContract,
        address _collectionContract
    ) external returns (address splitProxy) {
        merkleRoot = _merkleRoot;
        splitAsset = _splitAsset;
        royaltyAsset = _splitAsset;
        membershipContract = _membershipContract;

        splitProxy = createSplitProxy();
        address vault = createVaultProxy(splitProxy);

        ICoreCollection(_collectionContract).setRoyaltyVault(vault);

        emit VaultAssignedToCollection(vault, splitter, _collectionContract);
    }

    /**
     * @dev Deploys a new SplitProxy.
     * @param _merkleRoot The merkle root of the asset.
     * @param _splitAsset The address of the asset to split.
     * @param _membershipContract The address of the membership contract.
     */
    function createSplit(
        bytes32 _merkleRoot,
        address _splitAsset,
        address _membershipContract
    ) external returns (address splitProxy) {
        merkleRoot = _merkleRoot;
        splitAsset = _splitAsset;
        royaltyAsset = _splitAsset;
        membershipContract = _membershipContract;

        splitProxy = createSplitProxy();
        createVaultProxy(splitProxy);
    }

    /**
     * @dev Creates a new SplitProxy.
     */
    function createSplitProxy() private returns (address splitProxy) {
        splitProxy = address(
            new SplitProxy{salt: keccak256(abi.encode(merkleRoot))}()
        );

        emit SplitCreated(splitProxy, membershipContract);

        delete merkleRoot;
        delete splitAsset;
        delete membershipContract;
    }

    function createVaultProxy(address splitProxy)
        private
        returns (address vault)
    {
        splitterProxy = splitProxy;
        vault = address(
            new ProxyVault{salt: keccak256(abi.encode(splitProxy))}()
        );
        delete splitterProxy;
        delete royaltyAsset;
        emit VaultCreated(vault, splitProxy);
    }

    /**
     * @dev Set Platform fee for collection contract.
     * @param _platformFee Platform fee in scaled percentage. (5% = 200)
     * @param _vault vault address.
     */
    function setPlatformFee(address _vault, uint256 _platformFee) external {
        IRoyaltyVault(_vault).setPlatformFee(_platformFee);
    }

    /**
     * @dev Set Platform fee recipient for collection contract.
     * @param _vault vault address.
     * @param _platformFeeRecipient Platform fee recipient.
     */
    function setPlatformFeeRecipient(
        address _vault,
        address _platformFeeRecipient
    ) external {
        require(_vault != address(0), "Invalid vault");
        require(
            _platformFeeRecipient != address(0),
            "Invalid platform fee recipient"
        );
        IRoyaltyVault(_vault).setPlatformFeeRecipient(_platformFeeRecipient);
    }
}
