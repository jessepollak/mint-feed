'use client';
import { useState } from 'react';
import { useChainId } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { ContractFunctionParameters, encodeFunctionData, Hex } from 'viem';
import { usePermissions } from '../contexts/PermissionsContext';
import { signWithCredential } from 'webauthn-p256';

interface TransactionWrapperProps {
  value?: bigint;
  contracts: ContractFunctionParameters[];
  buttonText: string;
}

function encodeContractCall(contract: ContractFunctionParameters, value: bigint)  {
  return {
    to: contract.address as Hex,
    data: encodeFunctionData({
      abi: contract.abi,
      functionName: contract.functionName,
      args: contract.args
    }),
    value: value || BigInt(0)
  };
}

export default function TransactionWrapper({ value, contracts, buttonText }: TransactionWrapperProps) {
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const { sendCallsAsync } = useSendCalls();
  const { permissionsContext, credential } = usePermissions();

  const handleTransaction = async () => {
    setIsLoading(true);
    try {
      const calls = contracts.map(contract => encodeContractCall(contract, value || BigInt(0)))

      const transactionOptions: any = {
        chainId: 84532, // Base Sepolia
        calls: calls,
      };

      // If we have permissionsContext and credential, use them for session key transaction
      if (permissionsContext && credential) {

        const universalSandboxContract: ContractFunctionParameters[] = [
          {
            address: '0x244f5f7156Dcfc1eF0B214f91D1093741A6137dC',
            abi: [
              {
                inputs: [
                  { internalType: 'address', name: 'target', type: 'address' },
                  { internalType: 'bytes', name: 'calldata', type: 'bytes' },
                ],
                name: 'sandboxedCall',
                outputs: [],
                stateMutability: 'payable',
                type: 'function'
              }
            ],
            functionName: 'sandboxedCall',
            args: [
              calls[0].to, // blank mintReferral
              calls[0].data
            ]
          },
        ];

        transactionOptions.calls = [encodeContractCall(universalSandboxContract[0], value || BigInt(0))];
        transactionOptions.capabilities = {
          permissions: {
            context: permissionsContext,
          },
          paymasterService: {
            url: process.env.NEXT_PUBLIC_PAYMASTER_URL, // Make sure to set this in your .env file
          },
        };
        transactionOptions.signatureOverride = signWithCredential(credential);
      }

      const result = await sendCallsAsync(transactionOptions);
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
