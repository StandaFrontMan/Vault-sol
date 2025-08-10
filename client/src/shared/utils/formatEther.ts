import { ethers } from 'ethers'

export function formatEther(wei: ethers.BigNumberish): string {
  return ethers.formatEther(wei)
}
