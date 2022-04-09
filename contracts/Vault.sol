// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/escrow/Escrow.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault is Ownable {

    event Deposited(address indexed payee, uint256 weiAmount);
    event Withdrawn(address indexed payee, uint256 weiAmount);

    function depositsOf(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function deposit(uint amount, address token) public virtual onlyOwner {
        IERC20(token).transfer(address(this), amount);

        emit Deposited(token, amount);
    }

    function withdraw(uint amount, address token, address to) public virtual onlyOwner {
        IERC20(token).transferFrom(address(this), to, amount);

        emit Withdrawn(token, amount);
    }
}
