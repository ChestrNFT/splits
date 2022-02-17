// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IRoyaltyVault {
    function getCollectionContract() external view returns (address);
    function splitter() external view returns (address);
    function sendToSplit() external returns (bool);
    function getWethBalance() external view returns (uint256);
    function setWethAddress(address wethAddress) external;
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}
