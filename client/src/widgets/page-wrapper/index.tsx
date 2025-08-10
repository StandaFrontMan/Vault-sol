import { useEthereum } from '../../app/hooks/useEthereum'
import { CtBalanceBanner } from '../../feature'
import { ConnectBanner } from '../connect-banner'

export function PageWrapper() {
  const { provider } = useEthereum()

  if (!provider) {
    return <ConnectBanner />
  }

  return (
    <div>
      <CtBalanceBanner />
    </div>
  )
}
