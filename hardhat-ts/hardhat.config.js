import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';

require('dotenv').config();

const config = {
  solidity: {
    version: '0.8.17',
  },
  networks: {
    // for testnet
    'base-goerli': {
      url: 'https://wiser-blue-aura.base-goerli.quiknode.pro/a7e699d32d5c307d7110798e3957fa5880743d36/',
      accounts: [process.env.WALLET_KEY],
    },
    // for local dev environment
    'base-local': {
      url: 'http://localhost:8545',
      accounts: [process.env.WALLET_KEY],
    },
  },
  defaultNetwork: 'hardhat',
};

export default config;
