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
  const [estadoSala, setEstadoSala] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [estadoJuego, setEstadoJuego] = useState('esperando'); // 'esperando' o 'jugando'

  // 1) Avisar presencia al entrar
  useEffect(() => {
    if (roomId && jugadorId) {
      setJugadorPresente(roomId, jugadorId)
        .catch(console.error);
    }
  }, [roomId, jugadorId]);

  // 2) Escuchar la sala en Firebase
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = escucharSala(roomId, (data) => {
      setEstadoSala(data);
      setCargando(false);

      // 3) Actualizar estadoJuego según jugadores
      const p1 = data?.jugadores?.p1 || false;
      const p2 = data?.jugadores?.p2 || false;
      setEstadoJuego(p1 && p2 ? 'jugando' : 'esperando');
    });

    return () => unsubscribe();
  }, [roomId]);

  // 4) Funciones de juego
  const esMiTurno = estadoSala?.turno === jugadorId;
  const soyElControlador = estadoSala?.turno !== jugadorId;
  const preguntasPropias =
    estadoSala?.[`preguntas_${jugadorId}`] || [];
  const preguntasDelOtro =
    estadoSala?.[`preguntas_${estadoSala?.turno}`] || [];
  const puntajePropio = estadoSala?.puntajes?.[jugadorId] ?? 0;
  const preguntaActual = estadoSala
    ? estadoSala[`preguntas_${estadoSala.turno}`]?.find(
        (p) => p.estado === 'pendiente'
      )
    : null;

  const responder = async (nuevoEstado) => {
    if (!estadoSala || !preguntaActual) return;

    const clave = `preguntas_${estadoSala.turno}`;
    const arr = [...estadoSala[clave]];
    const idx = arr.findIndex((p) => p.letra === preguntaActual.letra);
    if (idx === -1) return;

    arr[idx] = { ...arr[idx], estado: nuevoEstado };
    const nuevosPuntajes = { ...estadoSala.puntajes };
    if (nuevoEstado === 'correcto') {
      nuevosPuntajes[estadoSala.turno] =
        (nuevosPuntajes[estadoSala.turno] || 0) + 1;
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
        // datos de sala
        estadoSala,
        cargando,
        estadoJuego,

        // helpers de turno
        esMiTurno,
        soyElControlador,

        // preguntas y puntajes
        preguntasPropias,
        preguntasDelOtro,
        preguntaActual,
        puntajePropio,

        // acciones
        responder,
        pasarTurno
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
