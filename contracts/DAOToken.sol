//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAOToken is ERC20 {

    bool isLocked = false;

    constructor(uint initialSupply, uint contributorAllocation, address vault, address treasury, string memory name, string memory symbol) ERC20(name, symbol){
        require(contributorAllocation >= 0 && contributorAllocation < initialSupply, "contributorAllocation must be greater than or equal to 0 and less than initialSupply");
        _mint(treasury, initialSupply - contributorAllocation);
        _mint(vault, contributorAllocation);
        isLocked = true;
    }

    function unlock() external {
        require(isLocked, "DAO token is not locked");
        isLocked = false;
    }

    function locked() external view returns(bool) {
        return isLocked;
    }

    function _beforeTokenTransfer(address from,
                                address to,
                                uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);

        require(!isLocked, "DAO token is locked");
    }
}
 