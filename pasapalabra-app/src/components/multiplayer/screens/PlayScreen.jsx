// src/components/multiplayer/PlayScreen.jsx
import React from 'react';
import Rosco from '../../Rosco';
import Pregunta from '../../Pregunta';
import Controles from '../../Controles';
import StatsMultiplayer from '../StatsMultiplayer';
import { useMultiplayer } from '../../../context/MultiplayerContext';


export default function PlayScreen({
  preguntasPropias,
  preguntaActual,
  esMiTurno,
  soyElControlador,
  responder,
  pasarTurno,
}) {

  
  const { estadoSala } = useMultiplayer();

  const jugadorEnTurno = estadoSala.turno;
  const tiempoInicialTurno = estadoSala?.tiempos?.[jugadorEnTurno] ?? 150;
  const tiempoRestanteTurno = estadoSala?.tiemposRestantes?.[jugadorEnTurno] ?? 150;

  const letraActual = preguntaActual?.letra;
  const indiceActual = preguntasPropias.findIndex(p => p.letra === letraActual);
  const preguntasEnJuego = estadoSala?.[`preguntas_${estadoSala?.turno}`] ?? [];


  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      <header className="text-center mb-4">
        <h2 className="text-3xl font-bold">Sala Multijugador</h2>
        <p className="text-lg">
          {esMiTurno ? 'Es tu turno' : 'Esperando la jugada del otro'}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Rosco + Stats */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex-1">
            <Rosco  preguntas={preguntasEnJuego}
                    indiceActual={indiceActual}
                    started={true}
             />
          </div>
          <div className="mt-4">
            <StatsMultiplayer
              tiempoInicial={tiempoInicialTurno}
              tiempoRestante={tiempoRestanteTurno}
              preguntas={preguntasEnJuego}
              started={true}
              isTimerActive={esMiTurno}
              onExpire={pasarTurno}
            />

          </div>
        </div>

        {/* Pregunta + Controles */}
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
}
