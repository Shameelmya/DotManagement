import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBrwC6txr6tsH57Q8jtuA5eIaj6XC9ujmA",
  authDomain: "dot-work-management.firebaseapp.com",
  projectId: "dot-work-management",
  storageBucket: "dot-work-management.firebasestorage.app",
  messagingSenderId: "1060013471169",
  appId: "1:1060013471169:web:02dafc0f953906276d2b40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize a secondary app for admin actions like creating users
export const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);

export { app };
