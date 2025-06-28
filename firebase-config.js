// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBqojENmsB1AbJo_WHzYMChelOkaeQbfmc",
  authDomain: "gestiondb-15e34.firebaseapp.com",
  projectId: "gestiondb-15e34",
  storageBucket: "gestiondb-15e34.firebasestorage.app",
  messagingSenderId: "581356971055",
  appId: "1:581356971055:web:95fcbdd7c168c87bed92da",
  measurementId: "G-CXQYKG21W5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
