// src/services/firebaseGameRTDB.js
import { dbRT } from '../firebase/index';
import {
  ref,
  set,
  get,
  update,
  onValue,
  onDisconnect,
} from 'firebase/database';
import { generarRoscoDesdeJSON } from '../utils/RoscoGenerator';

const salaPath = roomId => `salas/${roomId}`;
const salaRef = roomId => ref(dbRT, salaPath(roomId));
const fieldRef = (roomId, field) => ref(dbRT, `${salaPath(roomId)}/${field}`);
const jugadoresRef = roomId => fieldRef(roomId, 'jugadores');
const listoRef = roomId => fieldRef(roomId, 'listo');

/**
 * 1) Crear sala nueva con dos roscos y tiempos por defecto (150s)
 */
export async function crearSala(roomId, nombres = {}, jugadorId = 'p1') {
  const preguntas_p1 = generarRoscoDesdeJSON();
  const preguntas_p2 = generarRoscoDesdeJSON();
  const DEFAULT_TIME = 150;

  const defaultNombres = {
    p1: nombres?.p1 ?? 'Jugador 1',
    p2: nombres?.p2 ?? 'Jugador 2'
  };


  await update(salaRef(roomId), {
    version: Date.now(),
    turno: 'p1',
    turnConfirmed: false,
    turnEndAt: null,
    listo: { p1: false, p2: false },
    tiempos: { p1: DEFAULT_TIME, p2: DEFAULT_TIME },
    tiemposRestantes: { p1: DEFAULT_TIME, p2: DEFAULT_TIME },
    preguntas_p1,
    preguntas_p2,
    puntajes: { p1: 0, p2: 0 },
    nombres: defaultNombres
  });
}

export async function setNombreJugador(roomId, jugador, nombre) {
  if (jugador !== 'p1' && jugador !== 'p2') {
    throw new Error(`Jugador inválido: ${jugador}`);
  }
  await update(salaRef(roomId), {
    [`nombres/${jugador}`]: nombre
  });
}
/**
 * 2) Obtener sala una sola vez
 */
export async function obtenerSala(roomId) {
  const snap = await get(salaRef(roomId));
  return snap.exists() ? snap.val() : null;
}

/**
 * 3) Escuchar sala en tiempo real
 *    callback recibe siempre un objeto no-null
 *    Retorna la función de unsubscribe
 */
export function escucharSala(roomId, callback) {
  const unsub = onValue(salaRef(roomId), snap => {
    const data = snap.val();
    if (data) callback(data);
  });
  return unsub;
}

/**
 * 4) Marcar presencia de un jugador (p1|p2)
 */
export async function setPresencia(roomId, jugador) {
  if (jugador !== 'p1' && jugador !== 'p2') {
    throw new Error(`Jugador inválido: ${jugador}`);
  }
  await update(jugadoresRef(roomId), { [jugador]: true });
}

/**
 * 5) Register onDisconnect para limpiar presencia automáticamente
 */
export function onDisconnectPresencia(roomId, jugador) {
  const r = ref(dbRT, `${salaPath(roomId)}/jugadores/${jugador}`);
  return onDisconnect(r).set(false);
}

/**
 * 6) Marcar listo (preparado) de un jugador
 */
export async function marcarListo(roomId, jugador) {
  if (jugador !== 'p1' && jugador !== 'p2') {
    throw new Error(`Jugador inválido: ${jugador}`);
  }
  await update(listoRef(roomId), { [jugador]: true });
}

/**
 * 7) Confirmar inicio de turno: fija turnConfirmed y calcula turnEndAt
 *    @param durMs duración en milisegundos
 */
export async function confirmarTurno(roomId, durMs) {
  await update(salaRef(roomId), {
    turnConfirmed: true,
    turnEndAt: Date.now() + Number(durMs)
  });
}

/**
 * 8) Pasar turno al siguiente, guardando remaining del actual
 */
export async function pasarTurno(roomId, currentPlayer, remainingSec) {
  const next = currentPlayer === 'p1' ? 'p2' : 'p1';
  await update(salaRef(roomId), {
    turno: next,
    turnConfirmed: false,
    turnEndAt: null,
    [`tiemposRestantes/${currentPlayer}`]: Number(remainingSec)
  });
}

/**
 * 9) Ajustar tiempo inicial antes de empezar
 */
export async function setTiempoInicial(roomId, jugador, nuevoSec) {
  await update(salaRef(roomId), {
    [`tiempos/${jugador}`]: Number(nuevoSec),
    [`tiemposRestantes/${jugador}`]: Number(nuevoSec),
  });
}

/**
 * 10) Responder una pregunta y actualizar puntaje
 */
export async function responder(roomId, turno, nuevoEstado) {
  const sala = await obtenerSala(roomId);
  if (!sala) return;
  const key = `preguntas_${turno}`;
  const arr = Array.isArray(sala[key]) ? [...sala[key]] : [];
  const idx = arr.findIndex(p => p.estado === 'pendiente');
  if (idx < 0) return;
  arr[idx] = { ...arr[idx], estado: nuevoEstado };
  const punt = { ...(sala.puntajes || {}) };
  if (nuevoEstado === 'correcto') punt[turno] = (punt[turno] || 0) + 1;

  await update(salaRef(roomId), {
    [key]: arr,
    puntajes: punt
  });
}
