//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./Vault.sol";
import "./Treasury.sol";

contract PromiseToken is ERC20 {

    address _treasury;
    address _collateralToken;
    address _daoToken;
    Vault _vault;
    uint constant backingRatio = 1; // 1:1

    // TODO: add funder whitelist

    constructor(string memory name, string memory symbol, address collateralToken, address daoToken, address treasury, address vaultAddress) ERC20(name, symbol){
        _treasury = treasury;
        _collateralToken = collateralToken;
        _daoToken = daoToken;
        _vault = Vault(vaultAddress);
    }

    function mint(address to, uint256 amount, address mintedBy, uint mintMethod) public {
        console.log("Depositing collateral to vault of amount", amount, "by", _msgSender());

        if (mintMethod == 0){
            _vault.deposit(amount, _collateralToken, mintedBy);
        }
        console.log("Minting promises");
        _mint(to, amount);
    }

    function burnForCollateralToken(uint256 amount, address burnedBy) public {
        console.log("Burning promises for collateral of", burnedBy);
        _burn(burnedBy, amount);
        console.log("Withdrawing collateral", amount);
        _vault.withdraw(amount, _collateralToken, burnedBy);
    }

    function burnForDAOToken(uint256 amount, address burnedBy) public {
        console.log("Burning promises for dao tokens of", burnedBy);

        _burn(burnedBy, amount);
        console.log("Withdrawing dao token to caller ", amount);

        uint daoTokenAmount = amount * _vault.depositsOf(_daoToken) / totalSupply();
        _vault.withdraw(daoTokenAmount, _daoToken, burnedBy);
        console.log("Withdrawing collateral to treasury", amount);

        _vault.withdraw(amount, _collateralToken, _treasury);
    }

    function vault() public view returns (Vault){
        return _vault;
    }
}
