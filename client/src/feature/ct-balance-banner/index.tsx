import { useEffect, useState } from 'react'

import { useEthereum } from '../../app/hooks/useEthereum'
import { formatEther } from '../../shared/utils/formatEther'

export function CtBalanceBanner() {
  const { contract, provider } = useEthereum()
  const [balance, setBalance] = useState<string>('')

  useEffect(() => {
    const getCtBalance = async () => {
      if (!provider || !contract) return

      const bal = await provider.getBalance(contract.getAddress())
      setBalance(formatEther(bal))
    }

    getCtBalance()
  }, [contract, provider])

  return (
    <div>
      <p>Current contract balance is:</p>

      <p>{balance} ETH</p>
    </div>
  )
}
