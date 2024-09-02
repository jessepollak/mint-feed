import Image from 'next/image';
import { useEffect, useState } from 'react';
import TransactionWrapper from './TransactionWrapper';
import { ContractFunctionParameters } from 'viem';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';

interface FeedItemProps {
  tokenContract: `0x${string}`;
  tokenId: bigint;
  tokenURI: string;
  name: string;
}

const resolveIpfsUrl = (url: string) => {
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.slice(7)}`;
  }
  return url;
};

export default function FeedItem({ tokenContract, tokenId, tokenURI, name }: FeedItemProps) {
  const [metadata, setMetadata] = useState({ name, image: '' });
  const { address } = useAccount();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(resolveIpfsUrl(tokenURI));
        const data = await response.json();
        setMetadata({
          name: data.name || name,
          image: resolveIpfsUrl(data.image) || '',
        });
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, [tokenURI, name]);

  const contracts: ContractFunctionParameters[] = [
    {
      address: '0x777777722D078c97c6ad07d9f36801e653E356Ae',
      abi: [
        {
          inputs: [
            { internalType: 'address', name: 'mintTo', type: 'address' },
            { internalType: 'uint256', name: 'quantity', type: 'uint256' },
            { internalType: 'address', name: 'collection', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { internalType: 'address', name: 'mintReferral', type: 'address' },
            { internalType: 'string', name: 'comment', type: 'string' },
          ],
          name: 'mint',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'mint',
      args: [
        address, // logged in user address address
        1n, // quantity
        tokenContract,
        tokenId,
        '0x0000000000000000000000000000000000000000', // blank mintReferral
        '' // comment
      ],
      value: parseUnits('0.000111', 18)
    },
  ];

  console.log(contracts);

  return (
    <div className="border rounded-lg p-4 mb-4 w-full">
      <div className="relative w-full pb-[100%] mb-2">
        <Image 
          src={metadata.image} 
          alt={metadata.name} 
          layout="fill" 
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <h2 className="text-xl font-bold mb-2">{metadata.name}</h2>
      <TransactionWrapper 
        contracts={contracts}
        buttonText="Mint"
      />
    </div>
  );
}
