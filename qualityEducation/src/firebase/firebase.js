import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

/** Team project (owner's Firebase account): learnverse-hack-the-sem-2025 */
const firebaseConfig = {
  apiKey: "AIzaSyCaTE7Rn4ya-KQDo848m5-zWkIW3nCsHK8",
  authDomain: "learnverse-hack-the-sem-2025.firebaseapp.com",
  projectId: "learnverse-hack-the-sem-2025",
  storageBucket: "learnverse-hack-the-sem-2025.appspot.com",
  messagingSenderId: "737545318031",
  appId: "1:737545318031:web:0518fbef05eb5bf0924afa",
  measurementId: "G-9WJLPCK6N6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const functions = getFunctions(app, "us-central1");

export { app, auth, db, provider, functions };
