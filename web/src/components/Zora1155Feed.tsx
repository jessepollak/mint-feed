'use client';
import { useEffect, useState } from 'react';
import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { useChainId, usePublicClient } from 'wagmi';
import FeedItem from './FeedItem';
import { MintableReturn } from 'node_modules/@zoralabs/protocol-sdk/dist/mint/types';

interface TokenMetadata {
  id: string;
  name: string;
  image: string;
}

interface Zora1155FeedProps {
  collectionAddress: string;
}

// Helper function to resolve IPFS URLs using ipfs.io gateway
const resolveIpfsUrl = (url: string) => {
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.slice(7)}`;
  }
  return url;
};

export default function Zora1155Feed({ collectionAddress }: Zora1155FeedProps) {
  const [tokens, setTokens] = useState<MintableReturn[]>([]);
  const chainId = useChainId();
  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchTokens() {
      if (!publicClient) return;

      const collectorClient = createCollectorClient({ chainId, publicClient });

      try {
        const collection = await collectorClient.getTokensOfContract({
          tokenContract: collectionAddress as `0x${string}`,
        });

        setTokens(collection.tokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    }

    fetchTokens();
  }, [collectionAddress, chainId, publicClient]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {tokens.map((token) => (
        <FeedItem
          key={token.token.tokenId}
          tokenContract={collectionAddress as `0x${string}`}
          tokenId={BigInt(token.token.tokenId)}
          tokenURI={token.token.tokenURI}
          name=""
        />
      ))}
    </div>
  );
}