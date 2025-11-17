import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfQGLocAqVPNyk2w2Jyi0Pbej-Lz8tSYU",
  authDomain: "a-ki-pri-sa-ye.firebaseapp.com",
  projectId: "a-ki-pri-sa-ye",
  storageBucket: "a-ki-pri-sa-ye.firebasestorage.app",
  messagingSenderId: "187272078809",
  appId: "1:187272078809:android:a2841196fcd9735306e5c8"
};

// Désactiver Firebase temporairement pour que le site fonctionne
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed - running without backend:', error.message);
  // Mock db object pour éviter les erreurs
  db = null;
}

export { db };
