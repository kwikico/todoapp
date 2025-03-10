'use client';

import { initializeApp } from 'firebase/app';
// Import types but don't initialize services until needed
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Use lazy loading for Firebase services
let auth: Auth;
let db: Firestore;

// Functions to get the Firebase services (initialized on demand)
export const getAuth = async () => {
  if (!auth) {
    const { getAuth } = await import('firebase/auth');
    auth = getAuth(app);
  }
  return auth;
};

export const getFirestore = async () => {
  if (!db) {
    const { getFirestore } = await import('firebase/firestore');
    db = getFirestore(app);
  }
  return db;
};

export { app }; 