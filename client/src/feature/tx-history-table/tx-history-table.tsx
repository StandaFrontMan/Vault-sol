import { useTransactionsHistory } from '../../app/hooks/useTransactionsHistory'
import { TxHistoryTableCard } from './components/tx-history-table-card'
import { TxHistoryTableHead } from './components/tx-history-table-head'

export function TxHistoryTable() {
  const { history } = useTransactionsHistory()

  return (
    <div
      style={{
        borderRadius: '8px',
        padding: '16px',
        margin: '12px 0',
        border: '1px solid #e1e4e8',
        maxWidth: '600px',
        width: '100%',
      }}
    >
      <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
        Transaction History
      </h3>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}
      >
        <TxHistoryTableHead />

        <tbody>
          {history.map(tx => {
            const key = tx.txHash
            return <TxHistoryTableCard key={key} tx={tx} />
          })}
        </tbody>
      </table>
    </div>
  )
}
