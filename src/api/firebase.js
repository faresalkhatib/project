// src/api/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM6iUUshr6LYVvfWNkvhtWS8e_3lBlmO0",
  authDomain: "mutah-exam-reservation.firebaseapp.com",
  projectId: "mutah-exam-reservation",
  storageBucket: "mutah-exam-reservation.firebasestorage.app",
  messagingSenderId: "533482959244",
  appId: "1:533482959244:web:19e0d327067c36983426a9",
  measurementId: "G-4X5XSKNK8M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
