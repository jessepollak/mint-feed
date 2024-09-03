'use client';

import { useState } from 'react';
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { useAccount, useConnect } from 'wagmi';
import { useGrantPermissions } from 'wagmi/experimental';
import { Hex, parseEther, toFunctionSelector } from 'viem';
import { createCredential } from 'webauthn-p256';
import { usePermissions } from '../contexts/PermissionsContext';

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
};

export default function WalletWrapper({
  className,
  text,
  withWalletAggregator = false,
}: WalletWrapperParams) {
  const { permissionsContext, setPermissionsContext, setCredential } = usePermissions();

  if (typeof window === 'undefined') {
    return null;
  }

  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { grantPermissionsAsync } = useGrantPermissions();

  const grantPermissions = async () => {
    if (account.address) {
      const newCredential = await createCredential({ type: 'cryptoKey' });
      const response = await grantPermissionsAsync({
        permissions: [
          {
            address: account.address,
            chainId: 84532, // Base Sepolia
            expiry: 17218875770,
            signer: {
              type: 'key',
              data: {
                type: 'secp256r1',
                publicKey: newCredential.publicKey,
              },
            },
            permissions: [
              {
                type: 'native-token-recurring-allowance',
                data: {
                  allowance: parseEther('0.1'),
                  start: Math.floor(Date.now() / 1000),
                  period: 86400,
                },
              },
              {
                type: 'allowed-contract-selector',
                data: {
                  contract: '0x244f5f7156Dcfc1eF0B214f91D1093741A6137dC',
                  selector: toFunctionSelector('permissionedCall(bytes calldata call)'),
                },
              },
            ],
          },
        ],
      });
      const context = response[0].context as Hex;
      setPermissionsContext(context);
      setCredential(newCredential);
    }
  };

  return (
    <>
      <Wallet>
        <ConnectWallet
          withWalletAggregator={withWalletAggregator}
          text={text}
          className={className}
        >
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
            Go to Wallet Dashboard
          </WalletDropdownLink>
          <WalletDropdownFundLink />
          {!permissionsContext && (
            <button onClick={grantPermissions}>
              <WalletDropdownLink icon="key" href="#">
                Grant Session Key Permissions
              </WalletDropdownLink>
            </button>
          )}
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </>
  );
}