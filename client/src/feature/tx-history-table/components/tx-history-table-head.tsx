export function TxHistoryTableHead() {
  return (
    <thead>
      <tr>
        <th
          style={{
            textAlign: 'center',
            padding: '8px',
            borderBottom: '1px solid #ddd',
          }}
        >
          Type
        </th>

        <th
          style={{
            textAlign: 'center',
            padding: '8px',
            borderBottom: '1px solid #ddd',
          }}
        >
          Amount
        </th>

        <th
          style={{
            textAlign: 'center',
            padding: '8px',
            borderBottom: '1px solid #ddd',
          }}
        >
          Tx Hash
        </th>
      </tr>
    </thead>
  )
}
