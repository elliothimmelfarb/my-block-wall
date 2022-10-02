// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/// Post on people's walls and give/receive permission
/// to do so.
contract MyBlockWall {
  /// track addresses that an address has given permission to
  mapping (address => address[]) private permissionsGivenByAddress;

  /// track addresses that have given an address permission
  mapping (address => address[]) private permissionsReceivedByAddress;

  /// a user gives permission to another user to post on their wall
  event PermissionGiven(address indexed from, address indexed to);

  /// a user makes a post on another user's wall
  event Post(address indexed from, address indexed to, string message, string signature);

  function viewPermissionsGivenBySender() public view returns(address[] memory) {
    return permissionsGivenByAddress[msg.sender];
  }

  function viewPermissionsReceivedBySender() public view returns (address[] memory) {
    return permissionsReceivedByAddress[msg.sender];
  }

  function givePermission(address target) public {
    permissionsGivenByAddress[msg.sender].push(target);
    permissionsReceivedByAddress[target].push(msg.sender);
    emit PermissionGiven(msg.sender, target);
  }

  function postToWall(address target, string calldata message, string calldata signature) public {
    address[] memory permittedAccounts = permissionsReceivedByAddress[msg.sender];

    for (uint i = 0; i < permittedAccounts.length; i++) {
      if (permittedAccounts[i] == target) {
        emit Post(msg.sender, target, message, signature);
        return;
      }
    }

    revert("You don't have permission.");
  }
}