import { useEthereum } from '../../app/hooks/useEthereum'
import {
  CommitForm,
  CtBalanceBanner,
  DepositForm,
  RevealForm,
  TxHistoryTable,
  UserBalanceBanner,
  UserDepositBalance,
  WithdrawForm,
} from '../../feature'
import { ConnectBanner } from '../connect-banner'

export function PageWrapper() {
  const { provider } = useEthereum()

  if (!provider) {
    return <ConnectBanner />
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <CtBalanceBanner />

        <UserBalanceBanner />

        <UserDepositBalance />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          // alignItems: 'center',
          gap: '10px',
        }}
      >
        <DepositForm />

        <WithdrawForm />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          // alignItems: 'center',
          gap: '10px',
        }}
      >
        <CommitForm />

        <RevealForm />
      </div>

      <TxHistoryTable />
    </div>
  )
}
