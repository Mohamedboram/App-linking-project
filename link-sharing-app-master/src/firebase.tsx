import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCsfZiRpeQh-ATkhv9IDaUa3w-G7EL-CWI",
  authDomain: "link-sharing-app-cf196.firebaseapp.com",
  projectId: "link-sharing-app-cf196",
  storageBucket: "link-sharing-app-cf196.appspot.com",
  messagingSenderId: "390651467295",
  appId: "1:390651467295:web:8e45997fc2001d18caa72a",
  measurementId: "G-FVLJYC3B8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export default app;