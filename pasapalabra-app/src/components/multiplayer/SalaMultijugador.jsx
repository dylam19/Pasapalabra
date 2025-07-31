// src/components/multiplayer/SalaMultijugador.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { MultiplayerProvider, useMultiplayer } from '../../context/MultiplayerContext';
import Rosco from '../Rosco';
import Pregunta from '../Pregunta';
import Controles from '../Controles';
import Stats from '../Stats';
import MultiplayerEndScreen from './MultiplayerEndScreen';

const VistaDelJugador = () => {
  const {
    estadoSala,
    estadoJuego,
    cargando,
    preguntasPropias,
    preguntasDelOtro,
    preguntaActual,
    esMiTurno,
    soyElControlador,
    responder,
    pasarTurno,
    puntajePropio,
  } = useMultiplayer();

    if (cargando) {
    return <div className="text-white text-center mt-10">Cargando sala...</div>;
    }

    if (estadoJuego === 'esperando') {
    return (
        <div className="text-white text-center mt-10 text-3xl font-bold">
        Esperando a que ambos jugadores estén presentes...
        </div>
    );
    }

  const juegoFinalizado = () => {
    if (!estadoSala || !estadoSala.preguntas_p1 || !estadoSala.preguntas_p2) return false;
    return (
      !estadoSala.preguntas_p1.some((p) => p.estado === 'pendiente' || p.estado === 'pasado') &&
      !estadoSala.preguntas_p2.some((p) => p.estado === 'pendiente' || p.estado === 'pasado')
    );
  };

  if (cargando || !estadoSala) {
    return <div className="text-white text-center mt-10">Cargando sala...</div>;
  }

  if (juegoFinalizado()) {
    return <MultiplayerEndScreen puntajes={estadoSala.puntajes} />;
  }

  if (!preguntaActual) {
    return (
      <div className="text-white text-center mt-10">
        <h2 className="text-3xl font-bold mb-2">Juego finalizado 🎉</h2>
        <p>Puntajes:</p>
        <p>Jugador 1: {estadoSala.puntajes.p1}</p>
        <p>Jugador 2: {estadoSala.puntajes.p2}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      <header className="text-center mb-4">
        <h2 className="text-3xl font-bold">Sala: Multijugador</h2>
        <p className="text-lg">
          {esMiTurno ? 'Es tu turno para responder' : 'Te toca controlar al otro jugador'}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl">
          <Rosco preguntas={esMiTurno ? preguntasPropias : preguntasDelOtro} />
          <Stats puntaje={puntajePropio} editable={false} />
        </div>

        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl">
          <Pregunta pregunta={preguntaActual} mostrarPalabra={soyElControlador} />
          {soyElControlador && (
            <Controles
              onResponder={(tipo) => {
                responder(tipo);
                if (tipo !== 'correcto') pasarTurno();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SalaMultijugador = () => {
  const { roomId, jugadorId } = useParams();

  return (
    <MultiplayerProvider roomId={roomId} jugadorId={jugadorId}>
      <VistaDelJugador />
    </MultiplayerProvider>
  );
};

export default SalaMultijugador;