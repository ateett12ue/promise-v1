pragma solidity ^0.8.0;

import {PromiseToken} from "./PromiseToken.sol";
import {DAOToken} from "./DAOToken.sol";
import {CollateralToken} from "./CollateralToken.sol";
import {Treasury} from "./Treasury.sol";
import {Vault} from "./Vault.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Hub is Context {
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

    function fundContributor(uint daoId, address to, uint amount) external {
        _promiseTokens[daoId].mint(to, amount, msg.sender, 0);
        emit ContributorFunded(daoId, to, msg.sender, amount);
    }

    function unlockDAOTokens(uint daoId) external {
        _daoTokens[daoId].unlock();
        emit TokenUnlock(daoId, msg.sender);
    }

    function burnTokenForCollateral(uint daoId, uint amount) external {
        _promiseTokens[daoId].burnForCollateralToken(amount, msg.sender);
        emit TokenBurnedForCollateral(daoId, msg.sender, amount);
    }

    function burnTokenForDAOToken(uint daoId, uint amount) external {
        _promiseTokens[daoId].burnForDAOToken(amount, msg.sender);
        emit TokenBurnedForCollateral(daoId, msg.sender, amount);
    }


    // ========= Views =========
    function getCollateralTokenAddress(uint daoId) public view returns (address) {
        return address(_collateralTokens[daoId]);
    }

    function getDaoTokenAddress(uint daoId) public view returns (address) {
        return address(_daoTokens[daoId]);
    }

    function isLockedDaoToken(uint daoId) public view returns (bool) {
        return _daoTokens[daoId].locked();
    }

    function getCollateralLockedAmount(uint daoId) public view returns (uint) {
        return _promiseTokens[daoId].vault().depositsOf(address(_collateralTokens[daoId]));
    }

    function getDaoTokenAllocationAmountTowardsContributors(uint daoId) public view returns (uint) {
        return _promiseTokens[daoId].vault().depositsOf(address(_daoTokens[daoId]));
    }

    function getDaoTokenAllocationPercentageTowardsContributors(uint daoId) public view returns (uint) {
        return getDaoTokenAllocationAmountTowardsContributors(daoId) * 100 / _daoTokens[daoId].totalSupply();
    }

    function getDaoTokenTotalSupply(uint daoId) public view returns (uint) {
        return _daoTokens[daoId].totalSupply();
    }

    function getPromiseTokensTotalSuppy(uint daoId) public view returns (uint) {
        return _promiseTokens[daoId].totalSupply();
    }

    function getPromiseTokenAddress(uint daoId) public view returns (address) {
        return address(_promiseTokens[daoId]);
    }

    function getVaultAddress(uint daoId) public view returns (address) {
        return address(_promiseTokens[daoId].vault());
    }

    function getTreasuryAddress(uint daoId) public view returns (address) {
        return address(_treasuries[daoId]);
    }

    function getNumDAOs() public view returns (uint) {
        return currDaoId;
    }

    function getPromiseTokensBalance(uint daoId, address contributor) public view returns (uint) {
        return _promiseTokens[daoId].balanceOf(contributor);
    }

    function getDaoTokenBalance(uint daoId, address contributor) public view returns (uint) {
        return _daoTokens[daoId].balanceOf(contributor);
    }

    function getContributorClaimToDaoTokens(uint daoId, address contributor) public view returns (uint) {
        return getPromiseTokensBalance(daoId, contributor) * getDaoTokenAllocationAmountTowardsContributors(daoId) / getPromiseTokensTotalSuppy(daoId);
    }  

}
