// src/components/multiplayer/SalaMultijugador.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { MultiplayerProvider, useMultiplayer } from '../../context/MultiplayerContext';
import Rosco from '../Rosco';
import Pregunta from '../Pregunta';
import Controles from '../Controles';
import Stats from '../Stats';
import MultiplayerEndScreen from './MultiplayerEndScreen';
import TiempoSlider from '../TiempoSlider';   // importe directo

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
    tiempoInicial,
    tiempoRestante,
    setTiempoInicial,
    marcarListo,
  } = useMultiplayer();

  if (cargando || !estadoSala) {
    return <div className="text-white text-center mt-10">Cargando sala...</div>;
  }

  if (estadoJuego === 'esperando') {
    return (
      <div className="text-white text-center mt-10 text-3xl font-bold">
        Esperando a que ambos jugadores estén presentes...
      </div>
    );
  }

  if (estadoJuego === 'listo') {
    // Pre-juego: muestro el slider y el botón de “Estoy listo”
    return (
      <div className="text-center mt-10 space-y-6">
        <h2 className="text-white text-3xl">¡Ambos conectados!</h2>

        <div className="inline-flex items-center space-x-4">
          <TiempoSlider
            min={30}
            max={400}
            initialTime={tiempoInicial}
            onChange={setTiempoInicial}
          />
          <button
            className="p-3 bg-green-500 rounded-full shadow-lg"
            onClick={marcarListo}
            title="Estoy listo"
          >
          </button>
        </div>
      </div>
    );
  }

  // comprueba si ya acabó la partida (todas las preguntas respondidas)
  const partidaTerminada = () => {
    const { preguntas_p1 = [], preguntas_p2 = [] } = estadoSala;
    return (
      !preguntas_p1.some((p) => ['pendiente','pasado'].includes(p.estado)) &&
      !preguntas_p2.some((p) => ['pendiente','pasado'].includes(p.estado))
    );
  };

  if (partidaTerminada()) {
    return <MultiplayerEndScreen puntajes={estadoSala.puntajes} />;
  }

  // Modo “jugando”
  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      <header className="text-center mb-4">
        <h2 className="text-3xl font-bold">Sala Multijugador</h2>
        <p className="text-lg">
          {esMiTurno ? 'Es tu turno' : 'Esperando la jugada del otro'}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Columna Rosco + Stats */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl">
          <Rosco preguntas={esMiTurno ? preguntasPropias : preguntasDelOtro} />
          <Stats
            tiempoInicial={tiempoInicial}
            tiempoRestante={tiempoRestante}
            puntaje={puntajePropio}
            editable={false}
            isTimerActive={esMiTurno}
            onExpire={pasarTurno}
          />
        </div>

        {/* Columna Pregunta + Controles */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl">
          <Pregunta pregunta={preguntaActual} mostrarPalabra={soyElControlador} />
          {soyElControlador && (
            <Controles
              onResponder={(tipo) => {
                responder(tipo);
                if (tipo !== 'correcto') {
                  pasarTurno();
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function SalaMultijugador() {
  const { roomId, jugadorId } = useParams();
  return (
    <MultiplayerProvider roomId={roomId} jugadorId={jugadorId}>
      <VistaDelJugador />
    </MultiplayerProvider>
  );
}
