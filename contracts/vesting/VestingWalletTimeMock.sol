pragma solidity ^0.4.18;


import './VestingWallet.sol';


contract VestingWalletTimeMock is VestingWallet {

    uint public currentTime;

    function VestingWalletTimeMock(address _vestingToken, uint _currentTime)
    VestingWallet(_vestingToken) {
        currentTime = _currentTime;
    }

    function getTime() internal view returns (uint) {
        return currentTime;
    }

    function updateTime(uint _newtime) {
        currentTime = _newtime;
    }
}