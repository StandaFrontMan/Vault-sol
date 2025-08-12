import { useEffect, useState } from 'react'

import { useEthereum } from '../../app/hooks/useEthereum'
import { VaultErrors } from '../../contarcts/Vault/vaultErrors'
import { formatEther } from '../../shared/utils/formatEther'
import { parseEther } from '../../shared/utils/parseEther'

export function WithdrawForm() {
  const { signer, contract } = useEthereum()

  const [value, setValue] = useState<string>('')
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleWithdraw = async () => {
    if (!signer || !contract) return
    const ethValue = parseEther(value)

    try {
      const contractWithSigner = contract.connect(signer)
      const tx = await contractWithSigner.userWithdraw(ethValue)
      await tx.wait()

      setValue('')
    } catch (err: any) {
      const errorData = err.data || err?.error?.data
      const decoded = VaultErrors.parseError(errorData)

      alert(
        ` Needed ${formatEther(decoded?.args[1])} ETH but only ${formatEther(decoded?.args[0])} ETH available.`,
      )
    }
  }

  useEffect(() => {
    if (!contract) return

    const listener = (sender, amount) => {
      alert(`You withdraw ${formatEther(amount)} ETH`)
    }

    contract.on('WithdrawEvent', listener)

    return () => {
      contract.off('WithdrawEvent', listener)
    }
  }, [contract])

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
        disabled={!value}
        style={{
          width: '100%',
        }}
      >
        Withdraw
      </button>
    </div>
  )
}
