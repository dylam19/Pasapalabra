// src/components/multiplayer/PlayScreen.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Rosco from '../../Rosco';
import Pregunta from '../../Pregunta';
import Controles from '../../Controles';
import StatsMultiplayer from '../StatsMultiplayer';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { setPausaGlobal } from '../../../services/firebaseGame';

export default function PlayScreen({
  preguntasPropias,
  preguntaActual,
  esMiTurno,
  soyElControlador,
  responder,
  pasarTurno,
}) {
  const { roomId } = useParams();
  const [cambiandoTurno, setCambiandoTurno] = useState(false);

  const { estadoSala, pausaGlobal } = useMultiplayer();

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
        {/* ROSCO + STATS */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex-1">
            <Rosco
              preguntas={preguntasEnJuego}
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

        {/* PREGUNTA + CONTROLES */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl">
          {pausaGlobal && (
            <div className="text-center text-yellow-300 text-xl font-semibold mb-4 animate-pulse">
              Cambiando de turno...
            </div>
          )}

          {!pausaGlobal && (
            <>
              <Pregunta pregunta={preguntaActual} mostrarPalabra={soyElControlador} />
              {soyElControlador && (
                <Controles
                  onResponder={(tipo) => {
                    responder(tipo);

                    if (tipo !== 'correcto') {
                      setCambiandoTurno(true);
                      setPausaGlobal(roomId, true);

                      setTimeout(() => {
                        setPausaGlobal(roomId, false);
                        pasarTurno();
                        setCambiandoTurno(false);
                      }, 2000);
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
