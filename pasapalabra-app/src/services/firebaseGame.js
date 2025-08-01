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

export const setPausaGlobal = async (roomId, enPausa) => {
  await actualizarSala(roomId, { pausa: enPausa });
};

export const crearSala = async (roomId) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);
  const preguntas_p1 = generarRoscoDesdeJSON();
  const preguntas_p2 = generarRoscoDesdeJSON();

  const DEFAULT_TIME = 150;
  await setDoc(salaRef, {
    turno: 'p1',
    preguntas_p1,
    preguntas_p2,
    puntajes: { p1: 0, p2: 0 },
    jugadores: { p1: true, p2: false },
    listo:    { p1: false, p2: false },
    tiempos: { p1: DEFAULT_TIME, p2: DEFAULT_TIME },
    tiemposRestantes: { p1: DEFAULT_TIME, p2: DEFAULT_TIME },
    creada: serverTimestamp()
});
};

 export const reiniciarSala = async (roomId) => {
   const salaRef = doc(db, SALAS_COLLECTION, roomId);
   const preguntas_p1 = generarRoscoDesdeJSON();
   const preguntas_p2 = generarRoscoDesdeJSON();
   const DEFAULT_TIME = 150;

   await updateDoc(salaRef, {
     preguntas_p1,
     preguntas_p2,
     "puntajes.p1" : 0,
     "puntajes.p2" : 0,
     "listo.p1" : false,
     "listo.p2" : false,
     tiempos:           { p1: DEFAULT_TIME, p2: DEFAULT_TIME },
     tiemposRestantes:  { p1: DEFAULT_TIME, p2: DEFAULT_TIME },
     turno:             'p1',
     estado:            'listo',   // ← arrancamos directo la partida
   });
 };

export const setTiempoInicial = async (roomId, jugador, nuevoTiempo) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);
  await updateDoc(salaRef, {
    [`tiempos.${jugador}`]: nuevoTiempo,
    [`tiemposRestantes.${jugador}`]: nuevoTiempo
  });
};

export const setJugadorPresente = async (roomId, jugador) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);
  await updateDoc(salaRef, {
    [`jugadores.${jugador}`]: true
  });
};

export const obtenerSala = async (roomId) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);
  const docSnap = await getDoc(salaRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const actualizarSala = async (roomId, data) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);
  await updateDoc(salaRef, data);
};

export const escucharSala = (roomId, callback) => {
  const salaRef = doc(db, SALAS_COLLECTION, roomId);

  return onSnapshot(salaRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      console.warn('La sala no existe');
    }
  });

};
