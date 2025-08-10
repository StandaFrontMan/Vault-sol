import { useCallback, useEffect, useState } from 'react'

import { useEthereum } from '../../app/hooks/useEthereum'
import { formatEther } from '../../shared/utils/formatEther'

export function CtBalanceBanner() {
  const { contract, provider } = useEthereum()
  const [balance, setBalance] = useState<string>('')

  const fetchBalance = useCallback(async () => {
    if (!provider || !contract) return
    const bal = await provider.getBalance(contract.getAddress())
    setBalance(formatEther(bal))
  }, [provider, contract])

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
      <p>Current contract balance is:</p>

      <p>{balance} ETH</p>

      <button onClick={fetchBalance}>Update</button>
    </div>
  )
}
