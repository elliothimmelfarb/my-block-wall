// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/// Post on people's walls and give and receive permission
/// to do so.
contract MyBlockWall {
  /// track addresses that this address has given permission to
  mapping (address => address[]) private givenPermission;
  /// track addresses that have given this address permission
  mapping (address => address[]) private hasPermissionFrom;

  event PermissionGiven(address indexed from, address indexed to);

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
}