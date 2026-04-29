import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDby4HIcb8K_-pZssF60mKoSjNi7TcvqlQ",
  authDomain: "akiprisaye-officielle.firebaseapp.com",
  projectId: "akiprisaye-officielle",
  storageBucket: "akiprisaye-officielle.firebasestorage.app",
  messagingSenderId: "147409182593",
  appId: "1:147409182593:web:22cdfec5c8f281f7645280"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
