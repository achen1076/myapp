// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiasR29iyciIIBE1JOA6uj7ml4CYAsrJc",
  authDomain: "myapp-1076-3d875.firebaseapp.com",
  projectId: "myapp-1076-3d875",
  storageBucket: "myapp-1076-3d875.appspot.com",
  messagingSenderId: "581787438621",
  appId: "1:581787438621:web:bfec833d3620482bd300f4",
  measurementId: "G-9BVMS90B3K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
