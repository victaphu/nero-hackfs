'use client'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'

export const WalletProvider = ({ children }) => {
	const config = getDefaultConfig({
		appName: 'Nero',
		projectId: 'nerofs',
		chains: [mainnet, polygon, optimism, arbitrum, base],
		ssr: false, // If your dApp uses server side rendering (SSR)
	})

	const queryClient = new QueryClient()
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>{children}</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
