//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract CollateralToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol){
        _mint(_msgSender(), 1000);
    }
}
