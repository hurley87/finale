import { useContract, useProvider, useSigner } from 'wagmi';
import { ethers } from 'ethers';

import FinaleContract from './Finale.json';

const useFinaleContract = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const contract = useContract({
    address: '0xD6AdBacFA17BD766c8754CE8367082Fec03CEC87',
    abi: FinaleContract.abi,
    signerOrProvider: signer || provider,
  });

  const mint = async (to: string, tokenId: string) => {
    const tx = await contract?.mint(to, tokenId, {
      gasLimit: ethers.utils.hexlify(1000000),
      value: ethers.utils.parseEther('0.0023'),
    });
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
    const totalSupply = await contract?.totalSupply();
    return totalSupply;
  };

  return {
    contract,
    totalSupply,
    isAllowed,
    mint,
  };
};

export default useFinaleContract;
