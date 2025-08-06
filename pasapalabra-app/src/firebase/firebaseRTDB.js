// src/firebase/firebaseRTDB.js
import { dbRT } from './index';
import { ref, onValue, update, onDisconnect } from 'firebase/database';

 export const salaRef = (roomId) => ref(dbRT, `salas/${roomId}`);
 export const salaFieldRef = (roomId, field) =>
   ref(dbRT, `salas/${roomId}/${field}`);
 export const onSalaValue = (roomId, cb) =>
   onValue(salaRef(roomId), snapshot => cb(snapshot.val()));