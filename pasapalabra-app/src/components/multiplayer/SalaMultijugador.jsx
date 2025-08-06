// src/components/multiplayer/SalaMultijugador.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { MultiplayerProvider, useMultiplayer } from '../../context/MultiplayerContext';
import WaitingScreen from '../multiplayer/screens/WaitingScreen';
import ReadyScreen from '../multiplayer/screens/ReadyScreen';
import PlayScreen from '../multiplayer/screens/PlayScreen';
import EndScreen from '../multiplayer/screens/EndScreen';
import { AnimatePresence, motion } from 'framer-motion';

function VistaDelJugador() {
  const {
    estadoJuego,
    estadoSala,
    cargando,
    tiempoInicial,
    setTiempoInicial,
    marcarListo,
    preguntasPropias,
    preguntasDelOtro,
    preguntaActual,
    esMiTurno,
    soyElControlador,
    responder,
    pasarTurno,
    puntajePropio,
  } = useMultiplayer();

  const fadeConfig = {
    initial: { opacity: 0.7, y: 0 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
    transition: { duration: 0.3 },
  };

  // Definimos qué componente mostrar
  let pantallaActual = null;

  if (cargando || !estadoSala) {
    pantallaActual = <div className="text-white text-center mt-10">Cargando sala...</div>;
  } else if (estadoJuego === 'esperando') {
    pantallaActual = <WaitingScreen />;
  } else if (estadoJuego === 'listo') {
    pantallaActual = (
      <ReadyScreen
        preguntasPropias={preguntasPropias}
        tiempoInicial={tiempoInicial}
        setTiempoInicial={setTiempoInicial}
        puntajePropio={puntajePropio}
        onConfirmReady={marcarListo}
      />
    );
  } else {
    const { tiemposRestantes } = estadoSala;

    const preguntasP1 = estadoSala.preguntas_p1 || [];
    const preguntasP2 = estadoSala.preguntas_p2 || [];
    const partidaTerminada =
      preguntasP1.length > 0 &&
      preguntasP2.length > 0 &&
      !preguntasP1.some(p => ['pendiente', 'pasado'].includes(p.estado)) &&
      !preguntasP2.some(p => ['pendiente', 'pasado'].includes(p.estado));

    if (
      (estadoJuego === 'jugando' && tiemposRestantes?.p1 === 0 && tiemposRestantes?.p2 === 0) ||
      partidaTerminada
    ) {
      pantallaActual = (
        <EndScreen
          preguntas_p1={preguntasP1}
          preguntas_p2={preguntasP2}
          puntajes={estadoSala.puntajes}
        />
      );
    } else {
      pantallaActual = (
        <PlayScreen
          preguntasPropias={preguntasPropias}
          preguntasDelOtro={preguntasDelOtro}
          preguntaActual={preguntaActual}
          esMiTurno={esMiTurno}
          soyElControlador={soyElControlador}
          responder={responder}
          pasarTurno={pasarTurno}
          puntajePropio={puntajePropio}
        />
      );
    }
  }

  // 👇 Acá metemos la magia con AnimatePresence
  return (
    <AnimatePresence mode="wait">
      <motion.div key={estadoJuego} {...fadeConfig}>
        {pantallaActual}
      </motion.div>
    </AnimatePresence>
  );
}

export default function SalaMultijugador() {
  const { roomId, jugadorId } = useParams();

  return (
    <MultiplayerProvider roomId={roomId} jugadorId={jugadorId}>
      <VistaDelJugador />
    </MultiplayerProvider>
  );
}
