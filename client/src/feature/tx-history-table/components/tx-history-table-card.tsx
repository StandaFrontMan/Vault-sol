import type { VaultEvent } from '../../../app/hooks/useTransactionsHistory'
import { formatAddr } from '../../../shared/utils/formatAddr'

type Props = {
  tx: VaultEvent
}

export function TxHistoryTableCard({ tx }: Props) {
  return (
    <tr>
      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
        {tx.type}
      </td>

      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
        {tx.amount} ETH
      </td>

      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
        {formatAddr(tx.txHash)}
      </td>
    </tr>
  )
}
