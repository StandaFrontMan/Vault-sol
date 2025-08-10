import { useEthereum } from '../../app/hooks/useEthereum'
import { CtBalanceBanner, UserBalanceBanner } from '../../feature'
import { ConnectBanner } from '../connect-banner'

export function PageWrapper() {
  const { provider } = useEthereum()

  if (!provider) {
    return <ConnectBanner />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
      <CtBalanceBanner />

      <UserBalanceBanner />
    </div>
  )
}
