import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { sepolia } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

const projectId = '34fae84380df909ea70e8e2b6c355bc6'

// 2. App metadata
const metadata = {
  name: 'SkillBridge',
  description: 'Decentralized freelancing platform with escrow payments',
  url: 'http://localhost:5173', // 👈 match your dev domain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Use Sepolia for dev/test
const networks = [sepolia]

// 4. Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional
  }
})

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
