'use client';
import { useState } from 'react';
import { useChainId } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { ContractFunctionParameters, encodeFunctionData } from 'viem';

interface TransactionWrapperProps {
  value?: bigint;
  contracts: ContractFunctionParameters[];
  buttonText: string;
}

export default function TransactionWrapper({ value, contracts, buttonText }: TransactionWrapperProps) {
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const { sendCallsAsync } = useSendCalls();

  console.log(value, contracts, chainId)

  const handleTransaction = async () => {
    setIsLoading(true);
    try {
      const result = await sendCallsAsync({
        chainId,
        calls: contracts.map(contract => ({
          to: contract.address,
          data: encodeFunctionData({
            abi: contract.abi,
            functionName: contract.functionName,
            args: contract.args
          }),
          value: value
        }))
      });
      console.log('Transaction successful', result);
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full">
      <button
        onClick={handleTransaction}
        disabled={isLoading}
        className="mt-0 mr-auto ml-auto w-full max-w-full text-[white] bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}
