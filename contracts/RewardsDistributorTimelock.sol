// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./interfaces/IPancakeRouter02.sol";

import "@openzeppelin/contracts/governance/TimelockController.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IWETH is IERC20 {
    function deposit() external payable;

    function withdraw(uint256 wad) external;
}

/**
 * @dev Strategy functions that do not require timelock or have a timelock less than the min timelock
 */
interface IStrategy {
    function pause() external;

    function unpause() external;

    function rebalance(uint256 _borrowRate, uint256 _borrowDepth) external;

    function deleverageOnce() external;

    function leverageOnce() external;

    function wrapETH() external;

    // In case new vaults require functions without a timelock as well, hoping to avoid having multiple timelock contracts
    function noTimeLockFunc1() external;

    function noTimeLockFunc2() external;

    function noTimeLockFunc3() external;


    function emergencyWithdraw() external;

    function setIsEarnable(bool _isEarnable) external;

}


contract RewardsDistributorTimelock is
    TimelockController,
    ReentrancyGuard
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address payable public treasuryAddress;
    address payable public AVAStakingAddress;
    address public rewardAddress = 0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef;    //ava-sdn LP
    address public avaAddress = 0xb12c13e66AdE1F72f71834f2FC5082Db8C091358;     //kac

    uint256 public AVAStakingRewardsFactor; // X/10,000 of rewards go to AVA staking vault. The rest goes to treasury.

    event AVAStakingRewardsFactorChange(
        uint256 oldAVAStakingRewardsFactor,
        uint256 newAVAStakingRewardsFactor
    );

    /**
     * @dev Initializes the contract with a given `minDelay`.
     */
    constructor(
        uint256 _minDelay,
        address[] memory _proposers,
        address[] memory _executors,
        address payable _treasuryAddress,
        address payable _AVAStakingAddress,
        uint256 _AVAStakingRewardsFactor
    ) TimelockController(_minDelay, _proposers, _executors) {
        treasuryAddress = _treasuryAddress;
        AVAStakingAddress = _AVAStakingAddress;
        AVAStakingRewardsFactor = _AVAStakingRewardsFactor;
    }

    function setAVAStakingRewardsFactor(uint256 newAVAStakingRewardsFactor)
        external
        virtual
    {
        require(
            msg.sender == address(this),
            "TimelockController: caller must be timelock"
        );
        require(newAVAStakingRewardsFactor <= 1000, "Factor > 1000");
        emit AVAStakingRewardsFactorChange(
            AVAStakingRewardsFactor,
            newAVAStakingRewardsFactor
        );
        AVAStakingRewardsFactor = newAVAStakingRewardsFactor;
    }

    function pause(address _stratAddress) external onlyRole(EXECUTOR_ROLE) {
        IStrategy(_stratAddress).pause();
    }

    function unpause(address _stratAddress) external onlyRole(EXECUTOR_ROLE) {
        IStrategy(_stratAddress).unpause();
    }

    function rebalance(
        address _stratAddress,
        uint256 _borrowRate,
        uint256 _borrowDepth
    ) external onlyRole(EXECUTOR_ROLE) {
        IStrategy(_stratAddress).rebalance(_borrowRate, _borrowDepth);
    }

    function deleverageOnce(address _stratAddress)
        external
        onlyRole(EXECUTOR_ROLE)
    {
        IStrategy(_stratAddress).deleverageOnce();
    }

    function leverageOnce(address _stratAddress)
        external
        onlyRole(EXECUTOR_ROLE)
    {
        IStrategy(_stratAddress).leverageOnce();
    }

    function wrapETH(address _stratAddress) external onlyRole(EXECUTOR_ROLE) {
        IStrategy(_stratAddress).wrapETH();
    }

    // // In case new vaults require functions without a timelock as well, hoping to avoid having multiple timelock contracts
    function noTimeLockFunc1(address _stratAddress)
        external
        onlyRole(EXECUTOR_ROLE)
    {
        IStrategy(_stratAddress).noTimeLockFunc1();
    }

    function noTimeLockFunc2(address _stratAddress)
        external
        onlyRole(EXECUTOR_ROLE)
    {
        IStrategy(_stratAddress).noTimeLockFunc2();
    }

    function noTimeLockFunc3(address _stratAddress)
        external
        onlyRole(EXECUTOR_ROLE)
    {
        IStrategy(_stratAddress).noTimeLockFunc3();
    }

    function emergencyWithdraw(address _stratAddress) external onlyRole(EXECUTOR_ROLE){
        IStrategy(_stratAddress).emergencyWithdraw();
    }

    function setIsEarnable(address _stratAddress, bool _isEarnable) external onlyRole(EXECUTOR_ROLE){
        IStrategy(_stratAddress).setIsEarnable(_isEarnable);
    }


    function distributeRewards() external
    {
        uint256 rewardsAmt = IERC20(rewardAddress).balanceOf(address(this));

        if (AVAStakingRewardsFactor > 0) {
            uint256 AVAStakingRewards =
                rewardsAmt.mul(AVAStakingRewardsFactor).div(1000);
            IERC20(rewardAddress).safeTransfer(
                AVAStakingAddress,
                AVAStakingRewards
            );
            rewardsAmt = rewardsAmt.sub(AVAStakingRewards);
        }

        IERC20(rewardAddress).safeTransfer(treasuryAddress, rewardsAmt);
    }

    function _safeSwap(
        address _uniRouterAddress,
        uint256 _amountIn,
        uint256 _slippageFactor,
        address[] memory _path,
        address _to,
        uint256 _deadline
    ) internal virtual {
        uint256[] memory amounts =
            IPancakeRouter02(_uniRouterAddress).getAmountsOut(_amountIn, _path);
        uint256 amountOut = amounts[amounts.length.sub(1)];

        IPancakeRouter02(_uniRouterAddress)
            .swapExactTokensForTokensSupportingFeeOnTransferTokens(
            _amountIn,
            amountOut.mul(_slippageFactor).div(1000),
            _path,
            _to,
            _deadline
        );
    }
}
