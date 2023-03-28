import { useContract, useProvider, useSigner } from 'wagmi';
import { ethers } from 'ethers';

import FinaleContract from './Finale.json';

const useFinaleContract = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const contract = useContract({
    address: '0xf7F99aa0536cB41080DB5CBb07fd9fcDf0c54eC4',
    abi: FinaleContract.abi,
    signerOrProvider: signer || provider,
  });

  // string memory name, string memory email, string memory shippingAddress, string memory prompt

  const mint = async (
    to: string,
    tokenId: string,
    name: string,
    email: string,
    shippingAddress: string,
    items: string
  ) => {
    const tx = await contract?.mint(
      to,
      tokenId,
      name,
      email,
      shippingAddress,
      items,
      {
        gasLimit: ethers.utils.hexlify(1000000),
        value: ethers.utils.parseEther('0.023'),
      }
    );
    const receipt = await tx?.wait();
    return receipt;
  };

  const isAllowed = async (address: string) => {
    const isAllowed = await contract?.isAllowed(address);
    return isAllowed;
  };

  // create function that returns total supple of NFTs that have been minted
  // create function that returns the total supply of NFTs that have been minted by a specific address
  const totalSupply = async () => {
    const totalSupply = await contract?.getTotalSupply();
    return totalSupply;
  };

  const getCollectors = async () => {
    const collectors = await contract?.getCollectors();
    return collectors;
  };

  const collectorExistsFromAddress = async (address: string) => {
    const exists = await contract?.collectorExistsFromAddress(address);
    return exists;
  };

  return {
    contract,
    totalSupply,
    isAllowed,
    mint,
    collectorExistsFromAddress,
    getCollectors,
  };
};

export default useFinaleContract;
