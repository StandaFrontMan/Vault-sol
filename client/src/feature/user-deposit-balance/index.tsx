import { useCallback, useEffect, useState } from 'react'

import { useEthereum } from '../../app/hooks/useEthereum'
import { formatEther } from '../../shared/utils/formatEther'

export function UserDepositBalance() {
  const { contract, signer } = useEthereum()
  const [deposit, setDeposit] = useState<string>('')

  const fetchDeposit = useCallback(async () => {
    if (!contract || !signer) return
    const contractWithSigner = contract.connect(signer)
    const dep = await contractWithSigner.getUserDeposit()
    setDeposit(formatEther(dep))
  }, [contract, signer])

  useEffect(() => {
    fetchDeposit()
  }, [fetchDeposit])

  return (
    <div
      style={{
        borderRadius: '8px',
        padding: '16px',
        margin: '12px 0',
        border: '1px solid #e1e4e8',
        textAlign: 'center',
        maxWidth: '300px',
      }}
    >
      <p>Your current deposit is:</p>

      <p>{deposit} ETH</p>

      <button onClick={fetchDeposit}>Update</button>
    </div>
  )
}
