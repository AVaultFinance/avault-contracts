// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IZap {
    function zapOut(address _from, uint amount) external returns (uint, uint);
    function zapIn(address _to) external payable returns (uint);
    function zapInToken(address _from, uint amount, address _to) external returns (uint);
}