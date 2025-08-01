// src/components/multiplayer/SalaMultijugador.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { MultiplayerProvider, useMultiplayer } from '../../context/MultiplayerContext';
import WaitingScreen from '../multiplayer/screens/WaitingScreen';     // puedes dejarla inline o crearla
import ReadyScreen   from '../multiplayer/screens/ReadyScreen';
import PlayScreen    from '../multiplayer/screens/PlayScreen';
import EndScreen from '../multiplayer/screens/EndScreen';

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

  if (cargando || !estadoSala) {
    return <div className="text-white text-center mt-10">Cargando sala...</div>;
  }

  if (estadoJuego === 'esperando') {
    return <WaitingScreen />;
  }

  if (estadoJuego === 'listo') {
    return (
      <ReadyScreen
        preguntasPropias={preguntasPropias}
        tiempoInicial={tiempoInicial}
        setTiempoInicial={setTiempoInicial}
        puntajePropio={puntajePropio}
        onConfirmReady={marcarListo}
      />
    );
  }

  // si las listas de preguntas ya terminaron:
  const partidaTerminada = !estadoSala.preguntas_p1.some(p => ['pendiente','pasado'].includes(p.estado))
                        && !estadoSala.preguntas_p2.some(p => ['pendiente','pasado'].includes(p.estado));
  if (partidaTerminada) {
    return <EndScreen puntajes={estadoSala.puntajes} />;
  }

  // modo “jugando”
  return (
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

export default function SalaMultijugador() {
  const { roomId, jugadorId } = useParams();
  return (
    <MultiplayerProvider roomId={roomId} jugadorId={jugadorId}>
      <VistaDelJugador />
    </MultiplayerProvider>
  );
}
