'use client';

import React, { createContext, useContext } from 'react';
import useFirebaseAuth, { AuthState } from '../hooks/useFirebaseAuth';
import type { User } from 'firebase/auth';

interface FirebaseAuthContextProps extends AuthState {
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User | null>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextProps | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();

  return (
    <FirebaseAuthContext.Provider value={auth}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuthContext() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuthContext must be used within a FirebaseAuthProvider');
  }
  return context;
} 