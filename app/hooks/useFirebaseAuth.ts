'use client';

import { useState, useEffect } from 'react';
import type { User, Auth, UserCredential } from 'firebase/auth';
import { app, getAuth } from '../lib/firebase';

export interface AuthState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

export default function useFirebaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    user: null,
    error: null,
  });
  const [auth, setAuth] = useState<Auth | null>(null);

  // Initialize Firebase Auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authInstance = await getAuth();
        setAuth(authInstance);
      } catch (error) {
        console.error("Error initializing Firebase Auth:", error);
        setAuthState({
          loading: false,
          user: null,
          error: "Failed to initialize authentication."
        });
      }
    };
    
    initializeAuth();
  }, []);

  // Set up auth state listener once auth is initialized
  useEffect(() => {
    if (!auth) return;
    
    const { onAuthStateChanged } = require('firebase/auth');
    
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        setAuthState({
          loading: false,
          user,
          error: null,
        });
      },
      (error: Error) => {
        setAuthState({
          loading: false,
          user: null,
          error: error.message,
        });
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    if (!auth) return null;
    
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setAuthState({
        loading: false,
        user: userCredential.user,
        error: null,
      });
      return userCredential.user;
    } catch (error: any) {
      setAuthState({
        loading: false,
        user: null,
        error: error.message,
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) return null;
    
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setAuthState({
        loading: false,
        user: userCredential.user,
        error: null,
      });
      return userCredential.user;
    } catch (error: any) {
      setAuthState({
        loading: false,
        user: null,
        error: error.message,
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) return null;
    
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setAuthState({
        loading: false,
        user: userCredential.user,
        error: null,
      });
      return userCredential.user;
    } catch (error: any) {
      setAuthState({
        loading: false,
        user: null,
        error: error.message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) return;
    
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(auth);
      setAuthState({
        loading: false,
        user: null,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        loading: false,
        user: authState.user,
        error: error.message,
      });
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
} 