// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "holiday-project-788ad.firebaseapp.com",
  projectId: "holiday-project-788ad",
  storageBucket: "holiday-project-788ad.appspot.com",
  messagingSenderId: "1051662304605",
  appId: "1:1051662304605:web:1e5afc63390694c2ad54b4",
  measurementId: "G-FPYKWTC54F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

export {auth, db};
export default app;