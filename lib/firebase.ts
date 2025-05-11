import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Initialize Firebase and return the app instance
 * This ensures Firebase is initialized only once
 */
export const initFirebase = () => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp(); // Return the already initialized app
};

/**
 * Get the Firestore instance
 */
export const getFirestoreInstance = () => {
  const app = initFirebase();
  return getFirestore(app);
};

/**
 * Get the Auth instance
 */
export const getAuthInstance = () => {
  const app = initFirebase();
  return getAuth(app);
};

// Initialize Firebase when this module is imported
const app = initFirebase();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export the app instance
export default app;
