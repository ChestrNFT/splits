// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ICoreCollection} from "../../interfaces/ICoreCollection.sol";

contract MockCollection is ICoreCollection {
    address royaltyVault;

    function setRoyaltyVault(address _royaltyVault) external override {
        royaltyVault = _royaltyVault;
    }
}
