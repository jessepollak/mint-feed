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
import { useChainId } from 'wagmi';
import { ContractFunctionParameters } from 'viem';

interface TransactionWrapperProps {
  contracts: ContractFunctionParameters[];
  buttonText: string;
}

export default function TransactionWrapper({ contracts, buttonText }: TransactionWrapperProps) {
  const chainId = useChainId();

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
  };

  return (
    <div className="flex w-full">
      <Transaction
        contracts={contracts}
        className="w-full"
        chainId={chainId}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto w-full max-w-full text-[white]" text={buttonText}>
        </TransactionButton>
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
