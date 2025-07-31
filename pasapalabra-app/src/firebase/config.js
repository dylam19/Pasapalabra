import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBXoeHrcx44RWIudJIjKcltoqK0I8rNfY",
  authDomain: "rospopalabra.firebaseapp.com",
  projectId: "rospopalabra",
  storageBucket: "rospopalabra.firebasestorage.app",
  messagingSenderId: "272229603655",
  appId: "1:272229603655:web:5ab6a848af0d8083a95462",
  measurementId: "G-NMQQXJ1WWL"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Login anónimo al arrancar
signInAnonymously(auth).catch((error) => {
  console.error("Error al iniciar sesión anónima:", error);
});

export { db };
