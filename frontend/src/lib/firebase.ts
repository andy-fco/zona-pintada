import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBoPqMvjrbH1BKAb8X6DrIYu5QNdCu7trM",
  authDomain: "zona-pintada-548f5.firebaseapp.com",
  projectId: "zona-pintada-548f5",
  storageBucket: "zona-pintada-548f5.firebasestorage.app",
  messagingSenderId: "683058682959",
  appId: "1:683058682959:web:90d4e593c7712747f09e3a"
};

// Initialize Firebase safely avoiding duplicate initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
