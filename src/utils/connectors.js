import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337, 31337] // 主网、测试网和本地网络
});

export const NETWORK_CONFIG = {
  1337: {
    chainName: 'Localhost 8545',
    rpcUrls: ['http://localhost:8545'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    }
  }
};
