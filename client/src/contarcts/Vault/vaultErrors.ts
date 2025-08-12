import { Interface } from 'ethers'

export const VaultErrors = new Interface([
  'error InsufficientBalance(uint256 available, uint256 required)',
])
