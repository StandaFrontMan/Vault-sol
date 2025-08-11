// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is ReentrancyGuard {
  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
  }

  mapping(address => uint256) public deposits;

  modifier onlyOwner() {
    require(msg.sender == owner, "only owner");
    _;
  }

  receive() external payable {
    deposits[msg.sender] += msg.value;
  }

  fallback() external payable {
    deposits[msg.sender] += msg.value;
  }

  function userWithdraw(uint256 _amount) public payable nonReentrant {
    // 1 check
    require(deposits[msg.sender] >= _amount, "not enough balance");
    // 2 effect
    deposits[msg.sender] -= _amount;
    // 3 interaction
    (bool success,) = msg.sender.call{value: _amount}("");
    require(success, "faild");
  }

  function withdraw(address _to, uint256 _amount) payable external onlyOwner nonReentrant {
    require(address(this).balance > 0, "nothing to withdraw");
    (bool success,) = _to.call{value: _amount}("");
    require(success, "faild");
  }

  function getBalance() external view returns(uint256) {
    return address(this).balance;
  }

  function getUserDeposit() public view returns(uint256) {
    return deposits[msg.sender];
  }
}