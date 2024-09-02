'use client';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import { useChainId, usePublicClient } from 'wagmi';
import { createCollectorClient } from "@zoralabs/protocol-sdk";

interface TransactionWrapperProps {
  tokenContract: string;
  tokenId: bigint;
  quantityToMint: number;
}

export default function TransactionWrapper({ tokenContract, tokenId, quantityToMint }: TransactionWrapperProps) {
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const collectorClient = createCollectorClient({ chainId, publicClient });

  const handleMint = async () => {
    const { parameters } = await collectorClient.mint({
      tokenContract,
      mintType: "1155",
      tokenId,
      quantityToMint,
      mintComment: "Minted from feed",
    });

    return parameters;
  };

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
  };

  return (
    <div className="flex w-full">
      <Transaction
        prepare={handleMint}
        className="w-full"
        chainId={chainId}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto w-full max-w-full text-[white]">
          Mint
        </TransactionButton>
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
