import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { hederaTestnet, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const queryClient = new QueryClient()

const projectId = '34fae84380df909ea70e8e2b6c355bc6'

const metadata = {
  name: 'SkillBridge',
  description: 'Decentralized freelancing platform with escrow payments',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Customize Hedera network if needed
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  {
    ...hederaTestnet,
    rpcUrls: {
      default: {
        http: ['https://pool.arkhia.io/hedera/testnet/json-rpc/v1/a7d70a6dzPd0dd6ce39ckUzba634N7Pb']
      }
    }
  }
]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}