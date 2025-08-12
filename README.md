# Ethereum Vault Contract

A secure smart contract for depositing and withdrawing ETH with reentrancy protection.

## Features

- Deposit ETH via direct transfer or fallback
- Secure withdrawals with checks-effects-interactions pattern
- Reentrancy protection using OpenZeppelin's ReentrancyGuard
- Owner-restricted administrative functions
- Event logging for all transactions
- Real-time balance tracking

## Smart Contract Functions

### User Functions

- `receive()`/`fallback()` - Accept ETH deposits
- `userWithdraw(uint256 amount)` - Withdraw your deposited ETH
- `getUserDeposit()` - Check your deposited balance

### Admin Functions

- `withdraw(address to, uint256 amount)` - Owner-only withdrawal
- `getBalance()` - Check contract's total ETH balance

## Development

### Requirements

- Node.js (v16+ recommended)
- Hardhat
- OpenZeppelin Contracts
