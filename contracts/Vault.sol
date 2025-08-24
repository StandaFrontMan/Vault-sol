// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// Insufficient balance for transfer. Needed `required` but only
/// `available` available.
/// @param available balance available.
/// @param required requested amount to transfer.
error InsufficientBalance(uint256 available, uint256 required);

/// Zero balance to withdraw
/// @param warning - string text
error ZeroBalanceForWithdraw(string warning);

/// Only owner action
/// @param warning - string text
error OnlyOwnerAction(string warning);

/// Already existing user withdraw commit
/// @param warning - string text
error ExistingUserWithdrawCommit(string warning);

/// User withdraw commit not exist
/// @param warning - string text
error NonExistingUserWithdrawCommit(string warning);

/// Frozen funds error
/// @param warning - string text
error FrozenFunds(string warning);

contract Vault is ReentrancyGuard {
  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
  }

  mapping(address => uint256) public deposits;
  mapping(address => bytes32) public userWithdrawCommits;

  /**
    @notice Emit when somebody throw funds in contrct
    @param sender - sender address
    @param amount - amount of funds
   */
  event DepositEvent(address indexed sender, uint256 amount);

    /**
    @notice Emit when somebody withdraw funds
    @param sender - sender address
    @param amount - amount of funds
   */
  event WithdrawEvent(address indexed sender, uint256 amount);

    /**
    @notice Emit when user made a withdraw commit
   */
   event CreatedUserWithdrawEvent();

    /**
    @notice Emit when user delete a withdraw commit
   */
   event DeletedUserWithdrawEvent();

  modifier onlyOwner() {
    require(msg.sender == owner,
      OnlyOwnerAction({
        warning: "Only owner"
      })
    );
    _;
  }



  receive() external payable {
    deposits[msg.sender] += msg.value;
    emit DepositEvent(msg.sender, msg.value);
  }

  fallback() external payable {
    deposits[msg.sender] += msg.value;
    emit DepositEvent(msg.sender, msg.value);
  }



  function userWithdraw(uint256 _amount) public payable nonReentrant {
    // 1 check
    require(userWithdrawCommits[msg.sender] == bytes32(0),
      FrozenFunds({
        warning: "Your funds are frozen, delete or reveal commit first"
      })
    );

    require(deposits[msg.sender] >= _amount,
      InsufficientBalance({
        available: deposits[msg.sender],
        required: _amount
      })
    );
    // 2 effect
    deposits[msg.sender] -= _amount;
    // 3 interaction
    (bool success,) = msg.sender.call{value: _amount}("");
    require(success, "faild");

    emit WithdrawEvent(msg.sender, _amount);
  }


  function commitUserWithdraw(bytes32 _hashedWithdrawCommit) external {
    require(userWithdrawCommits[msg.sender] == bytes32(0),
      ExistingUserWithdrawCommit({
        warning: "Commit already exist"
      })
    );
    userWithdrawCommits[msg.sender] = _hashedWithdrawCommit;

    emit CreatedUserWithdrawEvent();
  }

  function revealUserWithdraw(uint256 _amount, bytes32 _secret) external payable {
    // 1 check
    require(deposits[msg.sender] >= _amount,
      InsufficientBalance({
        available: deposits[msg.sender],
        required: _amount
      })
    );

    bytes32 commit = keccak256(abi.encodePacked(msg.sender, _secret, _amount));
    require(userWithdrawCommits[msg.sender] == commit);
    // 2 effect
    deposits[msg.sender] -= _amount;
    delete userWithdrawCommits[msg.sender];
    // 3 interaction
    (bool success,) = msg.sender.call{value: _amount}("");
    require(success, "faild");

    emit WithdrawEvent(msg.sender, _amount);
  }

  function deleteUserWithdrawCommit() external {
    require(userWithdrawCommits[msg.sender] != bytes32(0),
      NonExistingUserWithdrawCommit({
        warning: "Commit not exist"
      })
    );

    delete userWithdrawCommits[msg.sender];

    emit DeletedUserWithdrawEvent();
  }


  function withdraw(address _to, uint256 _amount) payable external onlyOwner nonReentrant {
    require(address(this).balance > 0,
      ZeroBalanceForWithdraw({
        warning: "Zero balance for withdraw"
      })
    );
    (bool success,) = _to.call{value: _amount}("");
    require(success, "faild");

    emit WithdrawEvent(msg.sender, _amount);
  }



  function getBalance() external view returns(uint256) {
    return address(this).balance;
  }



  function getUserDeposit() public view returns(uint256) {
    return deposits[msg.sender];
  }
}