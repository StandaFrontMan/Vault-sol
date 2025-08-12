import { Fragment } from 'react/jsx-runtime'

import { useEthereum } from '../../app/hooks/useEthereum'
import {
  CtBalanceBanner,
  DepositForm,
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
    <Fragment>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        {/* TODO some error in CtBalanceBanner */}

        <CtBalanceBanner />

        <UserBalanceBanner />

        <UserDepositBalance />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <DepositForm />

        <WithdrawForm />
      </div>
    </Fragment>
  )
}
