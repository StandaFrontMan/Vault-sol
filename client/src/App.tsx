import './App.css'
import { EthereumProvider } from './app/provoders/AppProvider'
import { PageWrapper } from './widgets'

function App() {
  return (
    <EthereumProvider>
      <PageWrapper />
    </EthereumProvider>
  )
}

export default App
