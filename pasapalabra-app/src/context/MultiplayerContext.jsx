// src/context/MultiplayerContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  crearSala,
  escucharSala,
  actualizarSala,
  obtenerSala,
  reiniciarSala,
  setJugadorPresente
} from '../services/firebaseGame';

const MultiplayerContext = createContext();

export const useMultiplayer = () => useContext(MultiplayerContext);

export const MultiplayerProvider = ({
  roomId,
  jugadorId,
  children
}) => {
  const [estadoSala, setEstadoSala]       = useState(null);
  const [cargando, setCargando]           = useState(true);
  const [estadoJuego, setEstadoJuego]     = useState('esperando'); // 'esperando' | 'listo' | 'jugando'
  const [tiempoInicial, setTiempoInicial] = useState(150);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const tiempoRestanteCompartido = estadoSala?.tiemposRestantes?.[estadoSala?.turno] ?? tiempoRestante;
  const [pausaGlobal, setPausaGlobalState] = useState(false);

  /**
   * Reinicia la sala para una nueva partida en el mismo roomId.
   * Llama a crearSala, que sobrescribe el doc con nuevos rosco, puntajes y tiempos.
   */
  const iniciarJuego = async () => {
    try {
      await reiniciarSala(roomId);
      console.log('[OK] Reiniciada partida en sala', roomId);
    } catch (err) {
      console.error('Error al reiniciar partida:', err);
    }
  };

  const actualizarTiempoInicial = async (nuevoTiempo) => {
    // 1) React state
    setTiempoInicial(nuevoTiempo);

    // 2) Firestore: tiempos y tiemposRestantes
    await actualizarSala(roomId, {
      [`tiempos.${jugadorId}`]: nuevoTiempo,
      [`tiemposRestantes.${jugadorId}`]: nuevoTiempo,
    });
  };


  const marcarListo = async () => {
    try {
      await actualizarSala(roomId, {
        [`listo.${jugadorId}`]: true,
      });
      console.log(`[OK] Jugador ${jugadorId} marcó listo`);
    } catch (err) {
      console.error('Error al marcar listo:', err);
    }
  };

  // 1) Avisar presencia al entrar
  useEffect(() => {
    if (roomId && jugadorId) {
      setJugadorPresente(roomId, jugadorId).catch(console.error);
    }
  }, [roomId, jugadorId]);

  // 2) Escuchar la sala en Firebase
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = escucharSala(roomId, (data) => {
      setEstadoSala(data);
      setCargando(false);

      setPausaGlobalState(data?.pausa || false);

    // 3) Estado de juego: si Firestore trae un estado concreto, lo respetamos
    if (data?.estado) {
      setEstadoJuego(data.estado);

      // ── Si estamos en ReadyScreen y AMBOS marcaron listo, lanzamos el juego ──
      if (
        data.estado === 'listo' &&
        data.listo?.p1 === true &&
        data.listo?.p2 === true
      ) {
        // Solo un cliente debe disparar esto, elegimos p1
        if (jugadorId === 'p1') {
          actualizarSala(roomId, { estado: 'jugando' });
        }
      }
    } else {
      // fallback por presence + listo (si no tienes data.estado)
      const p1 = data?.jugadores?.p1 || false;
      const p2 = data?.jugadores?.p2 || false;
      const l1 = data?.listo?.p1    || false;
      const l2 = data?.listo?.p2    || false;

      if (!p1 || !p2) setEstadoJuego('esperando');
      else if (!l1 || !l2) setEstadoJuego('listo');
      else setEstadoJuego('jugando');
    }
    });

    return () => unsubscribe();
  }, [roomId]);

  // 4) Resetear tiempo cuando arranca el juego o cambia turno
  useEffect(() => {
  if (
    estadoJuego === 'jugando' &&
    estadoSala?.turno === jugadorId
  ) {
    const remote = estadoSala.tiemposRestantes?.[jugadorId] ?? tiempoInicial;
    setTiempoRestante(remote);
  }
  }, [estadoJuego, tiempoInicial]);

  // 5) Decrementar tiempo cada segundo SI es mi turno
  const esMiTurno = estadoSala?.turno === jugadorId;
  useEffect(() => {
    if (estadoJuego !== 'jugando' || !esMiTurno) return;

      const timer = setInterval(() => {
        setTiempoRestante((t) => {
          const next = t <= 1 ? 0 : t - 1;
          if (next === 0) {
            clearInterval(timer);
            responder('pasado').then(() => pasarTurno());
          }
          return next;
        });
      }, 1000);

    return () => clearInterval(timer);
  }, [estadoJuego, esMiTurno]);

  // 6) Resto de variables y funciones de juego
  const soyElControlador = estadoSala?.turno !== jugadorId;
  const preguntasPropias = estadoSala?.[`preguntas_${jugadorId}`] || [];
  const preguntasDelOtro = estadoSala?.[`preguntas_${estadoSala?.turno}`] || [];
  const puntajePropio    = estadoSala?.puntajes?.[jugadorId]    ?? 0;
  const preguntaActual   = estadoSala
    ? estadoSala[`preguntas_${estadoSala.turno}`]?.find(p => p.estado === 'pendiente')
    : null;

  const responder = async (nuevoEstado) => {
    if (!estadoSala || !preguntaActual) return;

    const clave = `preguntas_${estadoSala.turno}`;
    const arr   = [...estadoSala[clave]];
    const idx   = arr.findIndex(p => p.letra === preguntaActual.letra);
    if (idx === -1) return;

    arr[idx] = { ...arr[idx], estado: nuevoEstado };
    const nuevosPuntajes = { ...estadoSala.puntajes };
    if (nuevoEstado === 'correcto') {
      nuevosPuntajes[estadoSala.turno] = (nuevosPuntajes[estadoSala.turno] || 0) + 1;
    }

    await actualizarSala(roomId, {
      [clave]: arr,
      puntajes: nuevosPuntajes
    });
  };

 const pasarTurno = async () => {
   const current = jugadorId;
   const next    = estadoSala.turno === 'p1' ? 'p2' : 'p1';
   await actualizarSala(roomId, {
     // guardo tu tiempo final antes de ceder
     [`tiemposRestantes.${current}`]: tiempoRestante,
     turno: next
   });
 };

  return (
    <MultiplayerContext.Provider
      value={{
        estadoSala,
        cargando,
        estadoJuego,
        iniciarJuego,

        // temporizador
        tiempoInicial,
        setTiempoInicial: actualizarTiempoInicial,
        tiempoRestante: esMiTurno ? tiempoRestante : tiempoRestanteCompartido,

        // turno y control
        esMiTurno,
        soyElControlador,
        pausaGlobal,

        // datos rosco
        preguntasPropias,
        preguntasDelOtro,
        preguntaActual,
        puntajePropio,

        // acciones
        responder,
        marcarListo,
        pasarTurno
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
