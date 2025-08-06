// src/context/MultiplayerContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';
import {
  crearSala,
  obtenerSala,
  escucharSala,
  setPresencia,
  onDisconnectPresencia,
  marcarListo as marcarListoRT,
  confirmarTurno as confirmarTurnoRT,
  pasarTurno as pasarTurnoRT,
  setTiempoInicial as setTiempoInicialRT,
  responder as responderRT
} from '../services/firebaseGameRTDB';

const MultiplayerContext = createContext();
export const useMultiplayer = () => useContext(MultiplayerContext);

export function MultiplayerProvider({ roomId, jugadorId, children }) {
  // ─── Estados ─────────────────────────────────────────────────────────
  const [sala, setSala] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [estadoJuego, setEstadoJuego] = useState('esperando'); // 'esperando'|'listo'|'jugando'

  // Timer
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef(null);

  // Desuscripción RTDB
  const unsubRef = useRef(null);

  // Helpers
  const esMiTurno = sala?.turno === jugadorId;
  const soyElControlador = sala?.turno !== jugadorId;
  const tiempoInicial = sala?.tiempos?.[jugadorId] ?? 150;

  // ─── 1) Setup sala + listener ────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !jugadorId) return;
    let canceled = false;

    async function setup() {
      // 1.1) Crear sala si no existe
      const existing = await obtenerSala(roomId);
      if (!existing) {
        await crearSala(roomId);
      }

      // 1.2) Presencia + onDisconnect
      await setPresencia(roomId, jugadorId);
      onDisconnectPresencia(roomId, jugadorId);

      // 1.3) Listener RTDB
      unsubRef.current = escucharSala(roomId, data => {
        if (canceled) return;
        if (!data) return;

        const preguntasMias = data[`preguntas_${jugadorId}`] || [];
        const noHayPendientes = preguntasMias.every(p => p.estado !== 'pendiente');
        const hayPasadas = preguntasMias.some(p => p.estado === 'pasado');

        if (data.turno === jugadorId && noHayPendientes && !hayPasadas) {
          console.log('[DEBUG] Jugador sin palabras pendientes ni pasadas, pasando turno automáticamente');
          pasarTurnoRT(roomId, jugadorId, data.tiemposRestantes?.[jugadorId] ?? 0)
            .catch(console.error);
          return;
        }

        if (data.turno === jugadorId && noHayPendientes && hayPasadas) {
          const nuevasPreguntas = preguntasMias.map(p =>
            p.estado === 'pasado' ? { ...p, estado: 'pendiente' } : p
          );

          const updates = {};
          updates[`/salas/${roomId}/preguntas_${jugadorId}`] = nuevasPreguntas;

          import('firebase/database').then(({ getDatabase, ref, update }) => {
            const db = getDatabase();
            update(ref(db), updates).catch(console.error);
          });
        }

        if (data.version && data.version !== sala?.version) {
          console.log('[DEBUG] Nueva versión detectada, reafirmando presencia');
          setPresencia(roomId, jugadorId);
          onDisconnectPresencia(roomId, jugadorId);
        }

        // ── SKIP si este jugador no tiene tiempo y aún no confirmó ──
        const miTiempo = data.tiemposRestantes?.[jugadorId] ?? 0;
        if (data.turno === jugadorId && miTiempo === 0 && data.turnConfirmed === false) {
          // Pasamos el turno de inmediato sin pedir confirmación
          pasarTurnoRT(roomId, jugadorId, 0).catch(console.error);
          return;
        }
        // Normalizar
        const jugadores = data.jugadores || { p1: false, p2: false };
        const listo = data.listo || { p1: false, p2: false };

        // Calcular estadoJuego
        const bothIn = jugadores.p1 && jugadores.p2;
        const bothReady = listo.p1 && listo.p2;

        if (!bothIn) setEstadoJuego('esperando');
        else if (!bothReady) setEstadoJuego('listo');
        else setEstadoJuego('jugando');

        setSala(data);
        setCargando(false);

      });
    }

    setup().catch(console.error);

    return () => {
      canceled = true;
      if (unsubRef.current) unsubRef.current();
      clearInterval(timerRef.current);
    };
  }, [roomId, jugadorId]);

  const calcularRemaining = () => {
    const end = sala?.turnEndAt;
    if (!end) return remaining; // fallback
    return Math.max(Math.ceil((end - Date.now()) / 1000), 0);
  };

  const reiniciarSala = useCallback(async () => {
    const nombresAnteriores = sala?.nombres || {};
    await crearSala(roomId, nombresAnteriores, jugadorId);
    await setPresencia(roomId, jugadorId);
    onDisconnectPresencia(roomId, jugadorId);
  }, [roomId, jugadorId, sala]);
  

  // ─── 2) Timer del turno ───────────────────────────────────────────────
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!sala) return;

    const turnEnd = sala.turnEndAt;
    const baseRem = sala.tiemposRestantes?.[sala.turno] ?? tiempoInicial;

    // Solo bloquear timer si el jugador ACTIVO no ha confirmado
    if ((esMiTurno && !sala.turnConfirmed) || !turnEnd) {
      setRemaining(baseRem);
      return;
    }

    timerRef.current = setInterval(() => {
      const rem = Math.max(Math.ceil((turnEnd - Date.now()) / 1000), 0);
      setRemaining(rem);

      if (rem === 0 && esMiTurno) {
        clearInterval(timerRef.current);
        pasarTurnoRT(roomId, sala.turno, rem).catch(console.error);
      }
    }, 500);

    return () => clearInterval(timerRef.current);
  }, [sala, esMiTurno, tiempoInicial, roomId]);

  // ─── 3) Acciones ──────────────────────────────────────────────────────
  const marcarListo = useCallback(() => {
    return marcarListoRT(roomId, jugadorId);
  }, [roomId, jugadorId]);

  const confirmarTurno = useCallback(() => {
    const durSec = sala?.tiemposRestantes?.[jugadorId] ?? tiempoInicial;
    const durMs = durSec * 1000;
    return confirmarTurnoRT(roomId, durMs);
  }, [roomId, sala, jugadorId, tiempoInicial]);

  const pasarTurno = useCallback(() => {
    const rem = calcularRemaining();

    console.log('[DEBUG] tiemposRestantes:', sala.tiemposRestantes);
    console.log('[DEBUG] tiempo base usado:', rem);

    return pasarTurnoRT(roomId, sala.turno, rem);
  }, [roomId, sala, remaining]);

  const responder = useCallback((tipo) => {
    return responderRT(roomId, sala.turno, tipo);
  }, [roomId, sala]);

  const iniciarJuego = useCallback(() => {
    return crearSala(roomId);
  }, [roomId]);

  const setTiempoInicial = useCallback((nuevo) => {
    const sec = Number(nuevo) || 150;
    return setTiempoInicialRT(roomId, jugadorId, sec);
  }, [roomId, jugadorId]);

  // ─── 4) Datos para la UI ──────────────────────────────────────────────
  const preguntasPropias = sala?.[`preguntas_${jugadorId}`] || [];
  const preguntasDelOtro = sala?.[`preguntas_${sala?.turno}`] || [];
  let preguntaActual =
    preguntasDelOtro.find(p => p.estado === 'pendiente') ||
    preguntasDelOtro.find(p => p.estado === 'pasado') || null;
  const puntajePropio = sala?.puntajes?.[jugadorId] || 0;

  return (
    <MultiplayerContext.Provider value={{
      // Sala y estado
      estadoSala: sala,
      cargando,
      estadoJuego,
      iniciarJuego,
      reiniciarSala,

      // Timer
      tiempoInicial,
      setTiempoInicial,
      tiempoRestante: remaining,

      // Turnos
      esMiTurno,
      soyElControlador,
      marcarListo,
      confirmarTurno,
      pasarTurno,

      // Confirmación de turno
      turnConfirmed: sala?.turnConfirmed ?? false,

      // Juego
      jugadorId,
      preguntasPropias,
      preguntasDelOtro,
      preguntaActual,
      responder,
      puntajePropio,
    }}>
      {children}
    </MultiplayerContext.Provider>
  );
}
