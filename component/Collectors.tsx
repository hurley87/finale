import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Stack,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import useFinaleContract from '@/hooks/useFinaleContract';

const Collectors: NextPage = () => {
  const contract = useFinaleContract();
  const [collectors, setCollectors] = useState<any>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function init() {
      const collectors = await contract?.getCollectors();
      setCollectors(collectors.map((q: any) => ({ ...q })));
      setDone(true);
    }
    if (!done) init();
  }, [contract, done]);

  console.log(collectors);

  return (
    <Stack gap="4" pt="10" w="95%" mx="auto">
      <TableContainer>
        <Table>
          <TableCaption>Collectors</TableCaption>
          <Thead>
            <Tr>
              <Th>Token Id</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Shipping Address</Th>
              <Th>Items</Th>
              <Th>Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            {collectors.map((collector: any) => (
              <Tr key={collector.tokenId.toNumber()}>
                <Td>{collector.tokenId.toNumber()}</Td>
                <Td>{collector.name}</Td>
                <Td>{collector.email}</Td>
                <Td>{collector.addres}</Td>
                <Td>
                  {collector.prompt
                    .split(' spilling ')[0]
                    .replace('An open chest containing a ', '')}
                </Td>

                <Td>{collector.collectorAddress}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Collectors;
