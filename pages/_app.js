import { ChakraProvider } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { Toaster } from 'react-hot-toast';
import { baseGoerli } from 'wagmi/chains';

// const http =
//   'https://spring-young-tent.ethereum-sepolia.quiknode.pro/828de30c760b7c7568ceabb66fed417ec80799fd/';

// const http =
//   'https://clean-tame-gas.quiknode.pro/af85a689127d1541d0fd7e70029e3c2a8203fe3a/';

const http =
  'https://little-shy-feather.base-goerli.quiknode.pro/9ce46bdf099312e0e1cc22733b022d7f1455a600/';

const { chains, provider } = configureChains(
  [baseGoerli],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: () => ({
        http,
      }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: '712Drop',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
