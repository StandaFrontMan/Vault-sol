import { useState } from 'react'

import { useEthereum } from '../../app/hooks/useEthereum'
import { parseEther } from '../../shared/utils/parseEther'

export function WithdrawForm() {
  const { signer, contract, provider } = useEthereum()

  const [value, setValue] = useState<string>('')
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleWithdraw = async () => {
    if (!signer || !contract || !provider) return
    const ethValue = parseEther(value)
    try {
      const contractWithSigner = contract.connect(signer)
      const tx = await contractWithSigner.userWithdraw(ethValue)

      await tx.wait()
    } catch (error) {
      console.log(error)
    }
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
        onClick={handleWithdraw}
        style={{
          width: '100%',
        }}
      >
        Withdraw
      </button>
    </div>
  )
}
