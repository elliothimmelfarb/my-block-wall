// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title MyBlockWall
 * Post on people's walls (think basic facebook wall) and
 * give/receive permission to do so.
 * Users can see lists of who they have granted permission to
 * and who has granted them permissions. Users can assign
 * nicknames to users they have granted permission to.
 * Lists and relationships are locked down to only be viewable
 * by those users who have direct permission relationships with
 * eachother.
 */
contract MyBlockWall {
    /**
     * @dev track a list of addresses that an address has granted permission to
     */
    mapping(address => address[]) private grantedPermissionsByAddress;

    /**
     * @dev track a list of addresses that an address has received permission from
     */
    mapping(address => address[]) private receivedPermissionsByAddress;

    /**
     * @dev track nicknames
     */
    mapping(address => mapping(address => string)) private nickNamesByAddress;

    /**
     * @dev a user gives permission to another user to post on their wall
     */
    event PermissionGranted(address indexed from, address indexed to);

    /**
     * @dev a user makes a post on another user's wall
     */
    event Post(address indexed from, address indexed to, string message);

    /**
     * @dev only a sender is allowed to see who they have given permissions to
     */
    function viewGrantedPermissions() public view returns (address[] memory) {
        return grantedPermissionsByAddress[msg.sender];
    }

    /**
     * @dev only a sender is allowed to see who they have received permissions from
     */
    function viewReceivedPermissions() public view returns (address[] memory) {
        return receivedPermissionsByAddress[msg.sender];
    }

    /**
     * @dev only a user can view the nickname they've given to another user
     */
    function viewNickName(address target) public view returns (string memory) {
        require(
            isPermissionGranted(msg.sender, target),
            "Grant permission before viewing nicknames."
        );

        return nickNamesByAddress[msg.sender][target];
    }

    /**
     * @dev Set a nickname for a user that has permission to post on your wall
     */
    function setNickName(address target, string calldata newName) public {
        require(
            isPermissionGranted(msg.sender, target),
            "Grant permission before setting nicknames."
        );

        nickNamesByAddress[msg.sender][target] = newName;
    }

    /**
     * @dev grant permission. Permission can only be granted by sender.
     */
    function grantPermission(address target) public {
        require(
            !isPermissionGranted(msg.sender, target),
            "Permission is already granted."
        );

        // update data
        grantedPermissionsByAddress[msg.sender].push(target);
        receivedPermissionsByAddress[target].push(msg.sender);

        emit PermissionGranted(msg.sender, target);
    }

    /**
     * @dev only a sender can post to a wall that they have permission for
     */
    function postToWall(address target, string calldata message) public {
        require(
            isPermissionGranted(target, msg.sender),
            "You don't have permission."
        );

        emit Post(msg.sender, target, message);
    }

    /**
     * @dev check if permission has been granted by "from" address to "to" address.
     * @dev internal so it cannot be called from the outside
     */
    function isPermissionGranted(address from, address to)
        internal
        view
        returns (bool)
    {
        address[] memory permittedAccounts = grantedPermissionsByAddress[from];

        for (uint i = 0; i < permittedAccounts.length; i++) {
            if (permittedAccounts[i] == to) {
                return true;
            }
        }

        // permission is not granted
        return false;
    }
}
