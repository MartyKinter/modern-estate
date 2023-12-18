// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "zillow-clone-a0d72.firebaseapp.com",
  projectId: "zillow-clone-a0d72",
  storageBucket: "zillow-clone-a0d72.appspot.com",
  messagingSenderId: "818534587736",
  appId: "1:818534587736:web:ce3d4dfaa4f154c26a592d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);