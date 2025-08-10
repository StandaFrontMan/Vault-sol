import { ethers } from 'ethers'
import { type ReactNode, createContext, useEffect, useState } from 'react'

import abi from '../../contarcts/Vault/vault-abi.json'
import ctArtifacts from '../../contarcts/Vault/vault-artifacts.json'
import type { EthereumContextType } from '../types/context-type'

export const EthereumContext = createContext<EthereumContextType | undefined>(
  undefined,
)

export const EthereumProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  const connect = async () => {
    if (!window.ethereum) {
      console.error('MetaMask is not installed')
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    setProvider(provider)

    const signer = await provider.getSigner()
    setSigner(signer)

    const contract = new ethers.Contract(ctArtifacts.ct_addr, abi.abi, signer)
    setContract(contract)
  }

  useEffect(() => {
    connect()
  }, [])

  return (
    <EthereumContext.Provider value={{ provider, signer, contract, connect }}>
      {children}
    </EthereumContext.Provider>
  )
}
