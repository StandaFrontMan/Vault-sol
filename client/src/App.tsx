import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import './App.css'
import abi from './contarcts/Vault/vault-abi.json'
import ctArtifacts from './contarcts/Vault/vault-artifacts.json'

function App() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [ct, setCt] = useState<ethers.Contract | null>(null)
  const [balance, setBalance] = useState<string>('')

  useEffect(() => {
    const connection = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      setProvider(provider)

      const signer = await provider.getSigner()
      setSigner(signer)

      const contract = new ethers.Contract(ctArtifacts.ct_addr, abi.abi, signer)
      setCt(contract)

      const bal = await provider.getBalance(contract.getAddress())
      setBalance(ethers.formatEther(bal))
    }

    connection()
  }, [])

  const handleSendEth = async () => {
    const tx = await signer?.sendTransaction({
      to: ct?.getAddress(),
      value: ethers.parseEther('1'),
    })

    await tx?.wait()
  }

  const handkeUserWithdraw = async () => {
    const tx = await ct?.connect(signer).userWithdraw(ethers.parseEther('1'))

    await tx?.wait()
  }

  return (
    <>
      <div>
        <p>Contract Balance</p>
        <p>{balance ? `${balance} ETH` : 'Connect at first :)'}</p>
      </div>

      <button onClick={() => handleSendEth()}>send 1 eth</button>
      <button onClick={() => handkeUserWithdraw()}>withdraw 1 eth</button>
    </>
  )
}

export default App
