import type { ethers } from 'ethers'

export type EthereumContextType = {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  contract: ethers.Contract | null
  connect: () => Promise<void>
}
