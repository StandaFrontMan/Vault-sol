import { useContext } from 'react'

import { EthereumContext } from '../provoders/AppProvider'
import type { EthereumContextType } from '../types/context-type'

export const useEthereum = (): EthereumContextType => {
  const context = useContext(EthereumContext)
  if (!context) {
    throw new Error('useEthereum must be used within an EthereumProvider')
  }
  return context
}
