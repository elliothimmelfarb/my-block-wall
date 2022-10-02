// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/// Post on people's walls and give/receive permission
/// to do so.
contract MyBlockWall {
  /// track a list of addresses that an address has granted permission to
  mapping (address => address[]) private grantedPermissionsByAddress;

  /// track a list of addresses that an address has received permission from
  mapping (address => address[]) private receivedPermissionsByAddress;

  /// track nicknames
  mapping (address => mapping (address => string)) private nickNamesByAddress;

  /// a user gives permission to another user to post on their wall
  event PermissionGranted(address indexed from, address indexed to);

  /// a user makes a post on another user's wall
  event Post(address indexed from, address indexed to, string message);

  /// only a sender is allowed to see who they have given permissions to
  function viewGrantedPermissions() public view returns(address[] memory) {
    return grantedPermissionsByAddress[msg.sender];
  }

  /// only a sender is allowed to see who they have received permissions from
  function viewReceivedPermissions() public view returns (address[] memory) {
    return receivedPermissionsByAddress[msg.sender];
  }

  /// check if permission has been granted by "from" address to "to" address
  function isPermissionGranted(address from, address to) internal view returns (bool) {
    address[] memory permittedAccounts = grantedPermissionsByAddress[from];

    for (uint i = 0; i < permittedAccounts.length; i++) {
      if (permittedAccounts[i] == to) {
        return true;
      }
    }

    /// permission is not granted
    return false;
  }

  function viewNickName(address target) public view returns (string memory) {
    require(isPermissionGranted(msg.sender, target), 'Grant permission before viewing nicknames.');

    return nickNamesByAddress[msg.sender][target];
  }

  function setNickName(address target, string calldata newName) public {
    require(isPermissionGranted(msg.sender, target), 'Grant permission before setting nicknames.');

    nickNamesByAddress[msg.sender][target] = newName;
  }

  /// grant permission. Permission can only be granted by sender.
  function grantPermission(address target) public {
    require(!isPermissionGranted(msg.sender, target), "Permission is already granted.");

    // update data
    grantedPermissionsByAddress[msg.sender].push(target);
    receivedPermissionsByAddress[target].push(msg.sender);

    emit PermissionGranted(msg.sender, target);
  }

  /// only a sender can post to a wall that they have permission for
  function postToWall(address target, string calldata message) public {
    require(isPermissionGranted(target, msg.sender), "You don't have permission.");

    emit Post(msg.sender, target, message);
  }
}