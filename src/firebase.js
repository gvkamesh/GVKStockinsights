import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCh61gjv7BAaPNkDJZeZIkfpecjwly4JWY",
  authDomain: "portfolio-dashboard-9327e.firebaseapp.com",
  projectId: "portfolio-dashboard-9327e",
  storageBucket: "portfolio-dashboard-9327e.firebasestorage.app",
  messagingSenderId: "220209054215",
  appId: "1:220209054215:web:249c670c1ffd660700a0a2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
