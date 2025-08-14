import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { useEthereum } from './useEthereum'

export interface VaultEvent {
  type: 'deposit' | 'withdraw'
  sender: string
  amount: string
  txHash: string
  blockNumber: number
}

export function useTransactionsHistory() {
  const { contract } = useEthereum()
  const [history, setHistory] = useState<VaultEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    if (!contract) return

    try {
      setLoading(true)

      const depositFilter = contract.filters.DepositEvent()
      const withdrawFilter = contract.filters.WithdrawEvent()

      const deposits = await contract.queryFilter(depositFilter, 0, 'latest')
      const withdrawals = await contract.queryFilter(
        withdrawFilter,
        0,
        'latest',
      )

      const allEvents: VaultEvent[] = [
        ...deposits.map(ev => ({
          type: 'deposit',
          sender: ev.args.sender,
          amount: ethers.formatEther(ev.args.amount),
          txHash: ev.transactionHash,
          blockNumber: ev.blockNumber,
        })),
        ...withdrawals.map(ev => ({
          type: 'withdraw',
          sender: ev.args.sender,
          amount: ethers.formatEther(ev.args.amount),
          txHash: ev.transactionHash,
          blockNumber: ev.blockNumber,
        })),
      ]

      allEvents.sort((a, b) => a.blockNumber - b.blockNumber)
      setHistory(allEvents)
    } catch (err) {
      console.error('Error fetching vault history:', err)
    } finally {
      setLoading(false)
    }
  }, [contract])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { history, loading, fetchHistory }
}
