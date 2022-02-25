// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ICoreCollection} from "../../interfaces/ICoreCollection.sol";

contract MockCollection is ICoreCollection {
    address royaltyVault;

    /**
     * @dev Set the address of the RoyaltyVaultProxy contract
     */
    function setRoyaltyVault(address _royaltyVault) external override {
        royaltyVault = _royaltyVault;
    }
}
