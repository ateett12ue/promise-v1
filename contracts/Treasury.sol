// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact security@gitvern.org
contract Treasury is Pausable, Ownable {
    using SafeERC20 for IERC20;

    event Withdrawn(address indexed to, uint256 weiAmount);
    event Deposited(address indexed from, uint256 weiAmount);

    mapping(address => bool) private _managers;
    mapping(address => bool) private _funders;

    constructor() {
        addManager(_msgSender());
        addFunder(_msgSender());
    }



    // =============  Roles =============== /

    modifier onlyManager(address account) {
        require(isManager(account) == true, "Not a manager");
        _;
    }

    modifier onlyFunder(address account) {
        require(isFunder(account) == true, "Not a funder");
        _;
    }

    function isManager(address account) public view returns (bool) {
        return _managers[account];
    }

    function isFunder(address account) public view returns (bool) {
        return _funders[account];
    }

    function addManager(address newManager) public onlyManager(msg.sender) {
        require(newManager != address(0), "Invalid manager address");
        _managers[newManager] = true;
    }

    function removeManager(address removedManager) public onlyManager(msg.sender) {
        require(removedManager != address(0), "Invalid manager address");
        _managers[removedManager] = false;
    }


    function addFunder(address newFunder) public onlyManager(msg.sender) {
        require(newFunder != address(0), "Invalid funder address");
        _funders[newFunder] = true;
    }

    function removeFunder(address removedFunder) public onlyManager(msg.sender) {
        require(removedFunder != address(0), "Invalid funder address");
        _funders[removedFunder] = false;
    }

    function pause() public onlyManager(msg.sender) {
        _pause();
    }

    function unpause() public onlyManager(msg.sender) {
        _unpause();
    }


    function withdraw(address to, address token, uint amount) public onlyManager(msg.sender) whenNotPaused {
        require(amount <= IERC20(token).balanceOf(address(this)), "No withdrawable balance");

        IERC20(token).safeTransfer(to, amount);

        emit Withdrawn(to, amount);
    }

    function deposit(address from, uint amount, address token) public {
        IERC20(token).transfer(address(this), amount);

        emit Deposited(from, amount);
    }

    // =============  Views =============== /


    function balance(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}