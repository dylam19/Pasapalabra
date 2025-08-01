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

      // 3) Actualizar estadoJuego según jugadores y listo
      const p1 = data?.jugadores?.p1 || false;
      const p2 = data?.jugadores?.p2 || false;
      const l1 = data?.listo?.p1    || false;
      const l2 = data?.listo?.p2    || false;

      if (!p1 || !p2) {
        setEstadoJuego('esperando');
      } else if (!l1 || !l2) {
        setEstadoJuego('listo');
      } else {
        setEstadoJuego('jugando');

        console.log("game status updated");
        if (data.estado !== 'jugando' && jugadorId === 'p1') {
          // Solo p1 actualiza el estado para evitar conflictos
          actualizarSala(roomId, { estado: 'jugando' });
          console.log("room status updated");
        }

      }
    });

    return () => unsubscribe();
  }, [roomId]);

  // 4) Resetear tiempo cuando arranca el juego o cambia turno
  useEffect(() => {
    if (estadoJuego === 'jugando' && typeof tiempoInicial === 'number') {
      setTiempoRestante(tiempoInicial);
    }
  }, [estadoJuego, tiempoInicial]);

  // 5) Decrementar tiempo cada segundo SI es mi turno
  const esMiTurno = estadoSala?.turno === jugadorId;
  useEffect(() => {
    if (estadoJuego !== 'jugando' || !esMiTurno) return;

    const timer = setInterval(() => {
      setTiempoRestante((t) => {
        const nuevoTiempo = t <= 1 ? 0 : t - 1;

        // Actualizar tiempo restante del jugador en turno en Firestore
        actualizarSala(roomId, {
          [`tiemposRestantes.${jugadorId}`]: nuevoTiempo
        });

        // ⏱️ Si llega a 0, se pasa el turno
        if (nuevoTiempo === 0) {
          clearInterval(timer);
          responder('pasado').then(() => pasarTurno());
        }

        return nuevoTiempo;
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
    const next = estadoSala.turno === 'p1' ? 'p2' : 'p1';
    await actualizarSala(roomId, { turno: next });
  };

  return (
    <MultiplayerContext.Provider
      value={{
        estadoSala,
        cargando,
        estadoJuego,

        // temporizador
        tiempoInicial,
        setTiempoInicial,
        tiempoRestante : tiempoRestanteCompartido,

        // turno y control
        esMiTurno,
        soyElControlador,

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
