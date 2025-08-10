import { useEthereum } from '../../app/hooks/useEthereum'

export function ConnectBanner() {
  const { connect } = useEthereum()

  return (
    <>
      <p>Connect via MetaMask</p>

      <button onClick={connect}>Connect</button>
    </>
  )
}
