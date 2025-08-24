import { useState } from 'react'

export function RevealForm() {
  const [revealAmount, setRevealAmount] = useState('')
  const [revealSecret, setRevealSecret] = useState('')

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
        value={revealAmount}
        onChange={e => setRevealAmount(e.target.value)}
        placeholder="Commit amount"
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

      <input
        value={revealSecret}
        onChange={e => setRevealSecret(e.target.value)}
        placeholder="Secret"
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
        disabled={!revealSecret || !setRevealSecret}
        style={{
          width: '100%',
        }}
      >
        Reveal
      </button>
    </div>
  )
}
