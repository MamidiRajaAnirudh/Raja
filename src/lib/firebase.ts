// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-2764132839-63303",
  "appId": "1:406441932112:web:ab4c0333064e61627ea855",
  "storageBucket": "studio-2764132839-63303.firebasestorage.app",
  "apiKey": "AIzaSyAwNfIsE5azIWep08N0T1RMaQV7J2wygGg",
  "authDomain": "studio-2764132839-63303.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "406441932112"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
