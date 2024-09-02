'use client';
import { useEffect, useState } from 'react';
import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { useChainId, usePublicClient } from 'wagmi';

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
  const [tokens, setTokens] = useState<TokenMetadata[]>([]);
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

        const formattedTokens = await Promise.all(collection.tokens.map(async (token) => {
          let metadata: TokenMetadata = {};

          if (token.token.tokenURI) {
            const resolvedUrl = resolveIpfsUrl(token.token.tokenURI);
            try {
              const response = await fetch(resolvedUrl);
              const fetchedMetadata = await response.json();
              metadata = {
                name: fetchedMetadata.name || metadata.name,
                image: resolveIpfsUrl(fetchedMetadata.image) || metadata.image,
              };
            } catch (error) {
              console.error(`Error fetching metadata for token ${token.token.tokenId}:`, error);
            }
          }

          return {
            id: token.token.tokenId,
            name: metadata.name ?? 'Unnamed Token',
            image: metadata.image ?? 'default-image-url.jpg',
          };
        }));
        
        setTokens(formattedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    }

    fetchTokens();
  }, [collectionAddress, chainId, publicClient]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {tokens.map((token) => (
        <div key={token.id} className="w-full bg-white rounded-lg shadow-md">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img src={token.image} alt={token.name} className="w-full h-full object-contain rounded-t-lg" />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{token.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}