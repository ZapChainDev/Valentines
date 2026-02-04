import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD71nRwAU8CJUuGev1GV9w3KrYyE-YIFaE",
  authDomain: "valentines-ae013.firebaseapp.com",
  projectId: "valentines-ae013",
  storageBucket: "valentines-ae013.firebasestorage.app",
  messagingSenderId: "698116779953",
  appId: "1:698116779953:web:9995edbc246aeccaee5790",
  measurementId: "G-L2710SVBYZ",
};

// Initialize Firebase only on client-side
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (typeof window !== "undefined") {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

export { app, auth, db, googleProvider };
