import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Hex } from 'viem';
import { P256Credential } from 'webauthn-p256';

interface PermissionsContextType {
  permissionsContext: Hex | undefined;
  setPermissionsContext: React.Dispatch<React.SetStateAction<Hex | undefined>>;
  credential: P256Credential<'cryptokey'> | undefined;
  setCredential: React.Dispatch<React.SetStateAction<P256Credential<'cryptokey'> | undefined>>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [permissionsContext, setPermissionsContext] = useState<Hex | undefined>();
  const [credential, setCredential] = useState<P256Credential<'cryptokey'> | undefined>();

  return (
    <PermissionsContext.Provider value={{ permissionsContext, setPermissionsContext, credential, setCredential }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}