// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Vault {
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

  function userWithdraw(uint256 _amount) public payable {
    require(deposits[msg.sender] >= _amount, "not enough balance");

    (bool success,) = msg.sender.call{value: _amount}("");
    require(success, "faild");

    deposits[msg.sender] -= _amount;
  }

  function withdraw(address _to, uint256 _amount) payable external onlyOwner {
    require(address(this).balance > 0, "nothing to withdraw");
    (bool success,) = _to.call{value: _amount}("");
    require(success, "faild");
  }

  function getBalance() external view returns(uint256) {
    return address(this).balance;
  }
}