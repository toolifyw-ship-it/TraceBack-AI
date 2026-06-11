import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Safely load the build-time JSON config or fallback cleanly to env overrides
let firebaseConfig: any = {};
try {
  // @ts-ignore
  import configData from '../firebase-applet-config.json';
  firebaseConfig = configData;
} catch (e) {
  // Silent catch for headless or decoupled setups
}

const metaEnv = (import.meta as any).env || {};

const finalConfig = {
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || 'digital-portal-nw532',
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfig.appId || '1:707394046867:web:c5736f2d4f8194323af666',
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || 'AIzaSyAT-P9QVnETN1xgS5WYlRAaf94EZ3NHw3o',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || 'digital-portal-nw532.firebaseapp.com',
  firestoreDatabaseId: metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || 'ai-studio-8b8a5b2d-5fe8-4ad5-89c6-e18556ab1eb5',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || 'digital-portal-nw532.firebasestorage.app',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || '707394046867',
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId || ''
};

const app = initializeApp(finalConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, finalConfig.firestoreDatabaseId);
export const auth = getAuth(app);
