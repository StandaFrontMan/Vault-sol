import { useState } from 'react'

import { useEthereum } from '../../app/hooks/useEthereum'
import ctArtifacts from '../../contarcts/Vault/vault-artifacts.json'
import { parseEther } from '../../shared/utils/parseEther'

export function DepositForm() {
  const { signer } = useEthereum()

  const [value, setValue] = useState<string>('')

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleDeposit = async () => {
    if (!signer) return
    const tx = await signer.sendTransaction({
      to: ctArtifacts.ct_addr,
      value: parseEther(value),
    })

    await tx.wait()
  }

  return (
    <div
      style={{
        borderRadius: '8px',
        padding: '16px',
        margin: '12px 0',
        border: '1px solid #e1e4e8',
        maxWidth: '300px',
      }}
    >
      <input
        value={value}
        onChange={e => onInputChange(e)}
        placeholder="Amount to deposit"
        style={{
          width: '100%',
          padding: '8px 12px',
          marginBottom: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={handleDeposit}
        style={{
          width: '100%',
        }}
      >
        Deposit
      </button>
    </div>
  )
}
