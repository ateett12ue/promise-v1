pragma solidity ^0.8.0;

import {PromiseToken} from "./PromiseToken.sol";
import {DAOToken} from "./DAOToken.sol";
import {CollateralToken} from "./CollateralToken.sol";
import {Treasury} from "./Treasury.sol";
import {Vault} from "./Vault.sol";
import "hardhat/console.sol";

contract Hub {
    event DAOLaunch(uint daoId, address _daoToken, address _collateralToken, address _treasury, address _vault);
    event TokenUnlock(uint daoId, address unlockedBy);
    event TokenBurnedForCollateral(uint daoId, address burnedBy, uint256 amount);
    event TokenBurnedForDaoTokens(uint daoId, address burnedBy, uint256 amount);
    event ContributorFunded(uint daoId, address contributor, address fundedBy, uint256 amount);

    mapping (uint => Treasury) _treasuries;
    mapping (uint => PromiseToken) _promiseTokens;
    mapping (uint => DAOToken) _daoTokens;
    mapping (uint => CollateralToken) _collateralTokens;
    uint currDaoId = 0;

    constructor(){}
    function launchDAO(uint initialSupply, uint contributorAllocation, address collateralToken, string memory name, string memory symbol) external returns(uint) {
        currDaoId += 1;
        Treasury _treasury = new Treasury();
        console.log("Treasury address: ", address(_treasury));
        Vault _vault = new Vault();
        DAOToken _daoToken = new DAOToken(
            initialSupply,
            contributorAllocation,
            address(_vault),
            address(_treasury),
            name,
            symbol
        );
        PromiseToken _promiseToken = new PromiseToken(name, symbol, collateralToken, address(_daoToken), address(_treasury), address(_vault));
        _vault.transferOwnership(address(_promiseToken));
        _treasuries[currDaoId] = _treasury;
        _promiseTokens[currDaoId] = _promiseToken;
        _daoTokens[currDaoId] = _daoToken;
        _collateralTokens[currDaoId] = CollateralToken(collateralToken);
        emit DAOLaunch(currDaoId, address(_daoToken), address(collateralToken), address(_treasury), address(_vault));
        return currDaoId;
    }

    function unlockDAOTokens(uint daoId) external {
        _daoTokens[daoId].unlock();
        emit TokenUnlock(daoId, msg.sender);
    }

    function burnTokenForCollateral(uint daoId, uint amount) external {
        _promiseTokens[daoId].burnForCollateralToken(amount);
        emit TokenBurnedForCollateral(daoId, msg.sender, amount);
    }

    function burnTokenForDAOToken(uint daoId, uint amount) external {
        _promiseTokens[daoId].burnForDAOToken(amount);
        emit TokenBurnedForCollateral(daoId, msg.sender, amount);
    }

    function fundContributor(uint daoId, address to, uint amount) external {
        _promiseTokens[daoId].mint(to, amount);
        emit ContributorFunded(daoId, to, msg.sender, amount);
    }

    // ========= Views =========
    function getCollateralTokenAddress(uint daoId) external view returns (address) {
        return address(_collateralTokens[daoId]);
    }

    function getDaoTokenAddress(uint daoId) external view returns (address) {
        return address(_daoTokens[daoId]);
    }

    function isLockedDaoToken(uint daoId) external view returns (bool) {
        return _daoTokens[daoId].locked();
    }

    function getCollateralLockedAmount(uint daoId) external view returns (uint) {
        return _promiseTokens[daoId].vault().depositsOf(address(_collateralTokens[daoId]));
    }

    function getDaoTokenLockedAmount(uint daoId) external view returns (uint) {
        return _promiseTokens[daoId].vault().depositsOf(address(_daoTokens[daoId]));
    }

    function getDaoTokenTotalSupply(uint daoId) external view returns (uint) {
        return _daoTokens[daoId].totalSupply();
    }

    function getDaoTokenLockedPercentage(uint daoId) external view returns (uint) {
        return _promiseTokens[daoId].vault().depositsOf(address(_daoTokens[daoId])) * 100 / _daoTokens[daoId].totalSupply();
    }
}
