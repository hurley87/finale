import '@nomiclabs/hardhat-waffle';
require('@nomiclabs/hardhat-ethers');
// import { ethers } from 'hardhat';

import { allowlist } from './allowlist';

async function main() {
  // const NFT = await ethers.getContractFactory('Finale');
  // const nft = await NFT.deploy(allowlist);
  // await nft.deployed();
  // console.log('NFT Contract Deployed at ' + nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
