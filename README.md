# Ethereum Vault Contract

A secure smart contract for depositing and withdrawing ETH with reentrancy protection.

## Features

- Deposit ETH via direct transfer or fallback
- Secure withdrawals with checks-effects-interactions pattern
- Reentrancy protection using OpenZeppelin's ReentrancyGuard
- Owner-restricted administrative functions
- Event logging for all transactions
- Real-time balance tracking
- Custom error handling with detailed parameters
- Event-driven architecture for frontend updates

## Smart Contract Functions

### User Functions

- `receive()`/`fallback()` - Accept ETH deposits
- `userWithdraw(uint256 amount)` - Withdraw your deposited ETH
- `getUserDeposit()` - Check your deposited balance

### Admin Functions

- `withdraw(address to, uint256 amount)` - Owner-only withdrawal
- `getBalance()` - Check contract's total ETH balance

### Custom errors handleng

```javascript
try {
  const contractWithSigner = contract.connect(signer)
  const tx = await contractWithSigner.userWithdraw(ethValue)
  await tx.wait()

} catch (err: any) {
  const errorData = err.data || err?.error?.data
  const decoded = VaultErrors.parseError(errorData)

  alert(
    ` Needed ${formatEther(decoded?.args[1])} ETH but only ${formatEther(decoded?.args[0])} ETH available.`,
  )
}
```

## Event Handling (Frontend Integration)

### Contract Events

```javascript
// Deposit event
const listener = (sender, amount) => {
  alert(`You deposited ${formatEther(amount)} ETH`)
}

contract.on('DepositEvent', listener)

// Withdraw event
const listener = (sender, amount) => {
  alert(`You withdraw ${formatEther(amount)} ETH`)
}

contract.on('WithdrawEvent', listener)
```
