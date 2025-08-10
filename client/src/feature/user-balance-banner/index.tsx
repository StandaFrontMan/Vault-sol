import { useCallback, useEffect, useState } from 'react'

import { useEthereum } from '../../app/hooks/useEthereum'
import { formatEther } from '../../shared/utils/formatEther'

export function UserBalanceBanner() {
  const { contract, provider, signer } = useEthereum()
  const [balance, setBalance] = useState<string>('')

  const fetchBalance = useCallback(async () => {
    if (!provider || !contract || !signer) return

    const bal = await provider.getBalance(signer)

    setBalance(formatEther(bal))
  }, [provider, contract, signer])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

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
      <p>Your current balance is:</p>

      <p>{balance} ETH</p>

      <button onClick={fetchBalance}>Update</button>
    </div>
  )
}
