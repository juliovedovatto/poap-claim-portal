import { http, createConfig, injected } from 'wagmi';
import { baseSepolia } from 'viem/chains';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(),
  },
});
