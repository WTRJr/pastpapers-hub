import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDx6gJYfEbguN-r8yW9Gnj7szm-xgMMW0",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "pastpapers-hub.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "pastpapers-hub",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "pastpapers-hub.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "369960313135",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:369960313135:web:36ca44210291f303de9e3a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);