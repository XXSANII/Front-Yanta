// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHO2b-HCESa-AQ8OxAvvF4Zl0-At0KKEQ",
  authDomain: "family-yanta.firebaseapp.com",
  projectId: "family-yanta",
  storageBucket: "family-yanta.firebasestorage.app",
  messagingSenderId: "113658522055",
  appId: "1:113658522055:web:71ac42d3e5ffe6d43451e2",
  measurementId: "G-3CFCH3X0B7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);