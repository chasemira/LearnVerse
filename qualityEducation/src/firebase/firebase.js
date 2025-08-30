// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaTE7Rn4ya-KQDo848m5-zWkIW3nCsHK8",
  authDomain: "learnverse-hack-the-sem-2025.firebaseapp.com",
  projectId: "learnverse-hack-the-sem-2025",
  // storageBucket: "learnverse-hack-the-sem-2025.firebasestorage.app",
  storageBucket: "learnverse-hack-the-sem-2025.appspot.com",
  messagingSenderId: "737545318031",
  appId: "1:737545318031:web:0518fbef05eb5bf0924afa",
  measurementId: "G-9WJLPCK6N6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };