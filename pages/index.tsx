import { Box } from '@chakra-ui/react';
import { useSigner } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import useFinaleContract from '@/hooks/useFinaleContract';

export default function Home() {
  const { data: signer } = useSigner();
  const contract = useFinaleContract();
  const [isAllowed, setIsAllowed] = useState(false);

  //   get total supply on load in useEffect
  useEffect(() => {
    async function init() {
      const address = (await signer?.getAddress()) as string;
      const isAllowed = await contract?.isAllowed(address);
      setIsAllowed(isAllowed);
    }
    init();
  }, [contract, signer]);

  return (
    <Box>
      <ConnectButton />
      {signer && isAllowed && <Box>Form</Box>}
      {signer && !isAllowed && <Box>Not on the list</Box>}
    </Box>
  );
}
