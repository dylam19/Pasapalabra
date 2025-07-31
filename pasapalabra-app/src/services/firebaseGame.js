// src/services/firebaseGame.js
import { db } from '../firebase/config';
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

import { generarRoscoDesdeJSON } from '../utils/RoscoGenerator';

const SALAS_COLLECTION = 'salas';

export const crearSala = async (roomId) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);

  const preguntas_p1 = generarRoscoDesdeJSON();
  const preguntas_p2 = generarRoscoDesdeJSON();

  await setDoc(salaRef, {
    turno: 'p1',
    preguntas_p1,
    preguntas_p2,
    puntajes: {
      p1: 0,
      p2: 0
    },
    jugadores: {
      p1: true,
      p2: false
    },
    creada: serverTimestamp()
  });
};

export const setJugadorPresente = async (roomId, jugador) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);
  await updateDoc(salaRef, {
    [`jugadores.${jugador}`]: true
  });
};

export const obtenerSala = async (roomId) => {
  const salaRef = doc(db, 'salas', roomId);
  const docSnap = await getDoc(salaRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const actualizarSala = async (roomId, data) => {
  const salaRef = doc(db, 'salas', roomId);
  await updateDoc(salaRef, data);
};

export const escucharSala = (roomId, callback) => {
  const salaRef = doc(db, 'salas', roomId);
  return onSnapshot(salaRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      console.warn('La sala no existe');
    }
  });
};

