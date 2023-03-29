import {
  Box,
  Button,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { create } from 'ipfs-http-client';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useFinaleContract from '@/hooks/useFinaleContract';
import toast from 'react-hot-toast';
import TotalSupply from './TotalSupply';

const projectId = process.env.NEXT_PUBLIC_INFRA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFRA_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      'base64'
    )}`,
  },
});

// 0.3
const selectItemAtRandom = (ratio: number) => {
  const random = Math.random();
  if (random < ratio) {
    return true;
  }
  return false;
};

const FinaleMint: NextPage = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const { address } = useAccount();
  const contract = useFinaleContract();
  const [totalSupply, setTotalSupply] = useState(0);
  const [boxType, setBoxType] = useState('Default');
  const [email, setEamil] = useState('');
  const [name, setName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [img, setImg] = useState('');
  const [items, setItems] = useState<any>([]);
  const [hasMinted, setHasMinted] = useState(false);
  const [nft, setNFT] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const getFromIPFS = async (cid: string) => {
    const decoder = new TextDecoder();
    let content = '';
    for await (const chunk of ipfs.cat(cid)) {
      content += decoder.decode(chunk);
    }
    return content;
  };

  const getNFT = useCallback(async () => {
    const collectorAddress = address as string;
    const tokedId = await contract?.getCollectorTokenIdFromAddress(
      collectorAddress
    );
    const tokenId = tokedId.toNumber();
    const tokenURI = await contract?.contract?.tokenURI(tokenId);
    const ipfsHash = tokenURI.replace('https://ipfs.io/ipfs/', '');

    const content = await getFromIPFS(ipfsHash);

    try {
      const ipfsObject = JSON.parse(content);
      console.log(ipfsObject);
      setNFT(ipfsObject);
    } catch (e) {
      console.log(e);
    }
  }, [contract, address, setNFT]);

  const init = useCallback(async () => {
    const totalSupply = await contract?.totalSupply();
    const supply = totalSupply.toNumber();
    setTotalSupply(supply);

    const collectorAddress = address as string;
    const hasMinted = await contract?.collectorExistsFromAddress(
      collectorAddress
    );
    setHasMinted(hasMinted);
    if (hasMinted) getNFT();
    setLoaded(true);
  }, [contract, address, setTotalSupply, setHasMinted, setLoaded, getNFT]);

  useEffect(() => {
    if (!loaded) init();
  }, [init, loaded]);

  function getItems() {
    if (boxType === 'Default') {
      return ['Jacket'];
    } else {
      const items = ['Hat'];
      if (selectItemAtRandom(0.33)) items.push('Diner Mug');
      if (selectItemAtRandom(0.33)) items.push('Governance LOL Socks');
      if (selectItemAtRandom(0.17)) items.push('Bull Denim Tote');
      if (selectItemAtRandom(0.07)) items.push('EM Fanny');
      if (selectItemAtRandom(0.01)) items.push('Hedgey');
      if (selectItemAtRandom(0.033)) items.push('Windsurfing Tote');
      if (selectItemAtRandom(0.017)) items.push('Golden Ticket');
      return items;
    }
  }

  const handleMint = async () => {
    setIsMinting(true);
    console.log('Calling OpenAI...');

    const items = getItems();
    setItems(items);

    let prompt = `An open chest containing a leather jacket spilling out in the style of 80s computer retro, digital art, light aqua blue tint.`;
    if (boxType === 'Mystery') {
      prompt = `An open chest containing a ${items.join(
        ', '
      )} spilling out in the style of 80s computer retro, digital art, digital art, light aqua blue tint.`;
    }

    console.log('Prompt: ', prompt);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    const { url } = data;

    console.log('OpenAI Response: ', url);
    setImg(url);

    const attributes = [
      { trait_type: 'Box Type', value: boxType },
      { trait_type: 'Items', value: items },
    ];

    const mintJson = {
      name: 'Finale NFT',
      description: prompt,
      image: url,
      attributes,
    };
    console.log('Mint JSON: ', mintJson);
    const uploaded = await ipfs.add(JSON.stringify(mintJson));
    console.log('Uploaded Hash: ', uploaded);
    const path = uploaded.path;

    try {
      if (address) {
        const transaction = await contract.mint(
          address,
          path,
          name,
          email,
          shippingAddress,
          items.join(', ')
        );
        console.log('Transaction: ', transaction.transactionHash);
        setTransactionHash(transaction.transactionHash);
        toast.success('NFT minted!');
        setTotalSupply(totalSupply + 1);
        setHasMinted(true);
      }
      setIsMinting(false);
    } catch (e) {
      console.log('Error minting NFT: ', e);
      toast.error('Error minting NFT');
      setIsMinting(false);
    }
  };

  console.log('NFT: ', nft);

  return hasMinted ? (
    <Stack gap="4" maxW="lg" mx="auto" pt="10">
      <Text>{nft?.description}</Text>
      <Image alt="nft image" src={nft?.image} />
    </Stack>
  ) : (
    <Stack gap="4" maxW="lg" mx="auto" pt="10">
      {transactionHash === '' ? (
        <Stack>
          <Stack>
            <RadioGroup onChange={setBoxType} value={boxType}>
              <Stack direction="row">
                <Radio value="Default">Default</Radio>
                <Radio value="Mystery">Mystery</Radio>
              </Stack>
            </RadioGroup>
            <Text fontSize="sm" fontWeight="bold">
              Email
            </Text>
            <Input
              type="text"
              value={email}
              bg="white"
              size="sm"
              onChange={(e) => setEamil(e.target.value)}
            />
          </Stack>
          <Stack>
            <Text fontSize="sm" fontWeight="bold">
              Shipping Address
            </Text>
            <Input
              type="text"
              value={shippingAddress}
              bg="white"
              size="sm"
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </Stack>
          <Stack>
            <Text fontSize="sm" fontWeight="bold">
              Name
            </Text>
            <Input
              type="text"
              value={name}
              bg="white"
              size="sm"
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>
        </Stack>
      ) : (
        <Box>
          <Text>Box contains {items.join(', ')} </Text>
          <Image alt="img" src={img} />
        </Box>
      )}

      {transactionHash !== '' ? (
        <Button
          onClick={() =>
            window
              ?.open(
                `https://base-goerli.blockscout.com/tx/${transactionHash}`,
                '_blank'
              )
              ?.focus()
          }
        >
          View Transaction
        </Button>
      ) : (
        <Button
          isLoading={isMinting}
          onClick={handleMint}
          isDisabled={name === '' || email === '' || shippingAddress === ''}
        >
          Mint - 0.023 ETH
        </Button>
      )}
      <TotalSupply />
    </Stack>
  );
};

export default FinaleMint;
