import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Vercel backend deployment ba local server memory structure environment selector
const configEnv = process.env.VITE_FIREBASE_CONFIG 
  ? JSON.parse(process.env.VITE_FIREBASE_CONFIG)
  : null;

// Mock backup database template parameters map configuration to avoid build time collapse
const finalConfig = configEnv || {
  apiKey: "mock-key-placeholder",
  authDomain: "traceback-ai.firebaseapp.com",
  projectId: "traceback-ai",
  storageBucket: "traceback-ai.appspot.com",
  messagingSenderId: "00000000",
  appId: "1:0000:web:mock",
  firestoreDatabaseId: "(default)"
};

const app = initializeApp(finalConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, finalConfig.firestoreDatabaseId || '(default)');

export const auth = getAuth(app);
