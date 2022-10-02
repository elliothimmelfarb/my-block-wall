// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/// Post on people's walls and give/receive permission
/// to do so.
contract MyBlockWall {
  /// track addresses that an address has given permission to
  mapping (address => address[]) private givenPermission;

  /// track addresses that have given an address permission
  mapping (address => address[]) private hasPermissionFrom;

  /// a user gives permission to another user to post on their wall
  event PermissionGiven(address indexed from, address indexed to);

  /// a user makes a post on another user's wall
  event Post(address indexed from, address indexed to, string message, string signature);

  /// error for trying to post without permission
  error NoPermission();

  function viewGivenPermission() public view returns(address[] memory) {
    return givenPermission[msg.sender];
  }

  function viewHasPermissionFrom() public view returns (address[] memory) {
    return hasPermissionFrom[msg.sender];
  }

  function givePermission(address target) public {
    givenPermission[msg.sender].push(target);
    hasPermissionFrom[target].push(msg.sender);
    emit PermissionGiven(msg.sender, target);
  }

  function postToWall(address target, string calldata message, string calldata signature) public {
    address[] memory permittedAccounts = hasPermissionFrom[msg.sender];

    for (uint i = 0; i < permittedAccounts.length; i++) {
      if (permittedAccounts[i] == target) {
        emit Post(msg.sender, target, message, signature);
        return;
      }
    }

    revert("You don't have permission.");
  }
}