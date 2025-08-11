import { ethers } from 'ethers'

export function parseEther(ether: string): bigint {
  return ethers.parseEther(ether)
}
