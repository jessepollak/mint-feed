'use client';
import Footer from 'src/components/Footer';
import TransactionWrapper from 'src/components/TransactionWrapper';
import WalletWrapper from 'src/components/WalletWrapper';
import Zora1155Feed from 'src/components/Zora1155Feed';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import { useEffect } from 'react';

export default function Page() {
  const { address } = useAccount();

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (chainId !== 84532) {
      switchChain({ chainId: 84532 });
    }
  }, [chainId, switchChain]);

  // Replace this with the actual collection address you want to display
  const collectionAddress = '0x985f4402f83ad886971ba95bc80a3500d0d50c4e';

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <h1 className="text-2xl font-bold">Mint Feed</h1>
          <div className="flex items-center gap-4">
            <SignupButton/>
            {!address && <LoginButton />}
          </div>
        </div>
      </section>
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-2 py-4 md:grow">
        {address ? (
          <>
            <Zora1155Feed collectionAddress={collectionAddress} />
          </>
        ) : (
          <WalletWrapper
            className="w-[450px] max-w-full"
            text="Sign in to view and mint"
          />
        )}
      </section>
      <Footer />
    </div>
  );
}
