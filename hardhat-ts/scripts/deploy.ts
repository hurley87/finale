import hre from 'hardhat';
import { allowlist } from './allowlist';

const { ethers } = hre;

async function main() {
  const NFT = await ethers.getContractFactory('Finale');
  const nft = await NFT.deploy(allowlist);

  await nft.deployed();

  console.log('NFT Contract Deployed at ' + nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
