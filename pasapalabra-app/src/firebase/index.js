// src/firebase/index.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBXoeHrcx44RWIudJIjKcltoqK0I8rNfY",
  authDomain: "rospopalabra.firebaseapp.com",
  databaseURL: "https://rospopalabra-default-rtdb.firebaseio.com/",
  projectId: "rospopalabra",
  storageBucket: "rospopalabra.firebasestorage.app",
  messagingSenderId: "272229603655",
  appId: "1:272229603655:web:5ab6a848af0d8083a95462",
  measurementId: "G-NMQQXJ1WWL"
};

// 2. Inicializa la app **solo una vez**
const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// 3. Exporta los servicios
export const dbFS = getFirestore(app);
export const dbRT = getDatabase(app);
export const auth = getAuth(app);

// 4. (Opcional) Login anónimo al arrancar
signInAnonymously(auth).catch(console.error);

