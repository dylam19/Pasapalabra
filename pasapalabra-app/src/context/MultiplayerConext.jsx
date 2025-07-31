// src/context/MultiplayerContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  crearSala,
  escucharSala,
  actualizarSala,
  obtenerSala
} from '../services/firebaseGame';

const MultiplayerContext = createContext();
export const useMultiplayer = () => useContext(MultiplayerContext);

export const MultiplayerProvider = ({ roomId, jugadorId, children }) => {
  const [estadoSala, setEstadoSala] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    const unsubscribe = escucharSala(roomId, (data) => {
      setEstadoSala(data);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Determinar si es el turno del jugador
  const esMiTurno = estadoSala?.turno === jugadorId;
  const soyElControlador = estadoSala?.turno !== jugadorId;

  // Determinar roscos
  const preguntasPropias = estadoSala?.[`preguntas_${jugadorId}`] || [];
  const preguntasDelOtro = estadoSala?.[`preguntas_${estadoSala?.turno}`] || [];

  // Determinar puntaje propio
  const puntajePropio = estadoSala?.puntajes?.[jugadorId] ?? 0;

  // Obtener pregunta actual del jugador EN TURNO
  const preguntaActual = estadoSala?.[`preguntas_${estadoSala.turno}`]?.find(
    (p) => p.estado === 'pendiente'
  );

  // Marcar respuesta
  const responder = async (nuevoEstado) => {
    if (!estadoSala || !preguntaActual) return;

    const clavePreguntas = `preguntas_${estadoSala.turno}`;
    const preguntas = [...estadoSala[clavePreguntas]];
    const idx = preguntas.findIndex((p) => p.letra === preguntaActual.letra);

    if (idx === -1) return;

    preguntas[idx] = { ...preguntas[idx], estado: nuevoEstado };

    const nuevoPuntaje = { ...estadoSala.puntajes };
    if (nuevoEstado === 'correcto') {
      nuevoPuntaje[estadoSala.turno] = (nuevoPuntaje[estadoSala.turno] || 0) + 1;
    }

    await actualizarSala(roomId, {
      [clavePreguntas]: preguntas,
      puntajes: nuevoPuntaje,
    });
  };

  const pasarTurno = async () => {
    const proximo = estadoSala.turno === 'p1' ? 'p2' : 'p1';
    await actualizarSala(roomId, { turno: proximo });
  };

  return (
    <MultiplayerContext.Provider
      value={{
        estadoSala,
        cargando,
        turno: estadoSala?.turno,
        preguntasPropias,
        preguntasDelOtro,
        preguntaActual,
        esMiTurno,
        soyElControlador,
        responder,
        pasarTurno,
        puntajePropio
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
