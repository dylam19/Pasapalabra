// src/components/multiplayer/PlayScreen.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Rosco from '../../Rosco';
import Pregunta from '../../Pregunta';
import Controles from '../../Controles';
import StatsMultiplayer from '../StatsMultiplayer';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import HeaderRosco from '../../HeaderRosco';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';


export default function PlayScreen() {
  const { roomId } = useParams();
  const {
    estadoSala,
    esMiTurno,
    soyElControlador,
    estadoJuego,
    turnConfirmed,
    confirmarTurno,
    tiempoInicial,
    tiempoRestante,
    preguntasPropias,
    preguntasDelOtro,
    preguntaActual,
    responder,
    pasarTurno,
    jugadorId
  } = useMultiplayer();

  // Índice para Rosco
  const letra = preguntaActual?.letra;
  const indice = preguntasPropias.findIndex(p => p.letra === letra);

  const nombres = estadoSala?.nombres || {};
  const jugadorActual = jugadorId; // ← ya lo tenés del context
  const oponenteId = jugadorActual === 'p1' ? 'p2' : 'p1';
  const nombreOponente = nombres?.[oponenteId] || 'el oponente';
  
  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      {HeaderRosco()}
      <div className="flex flex-col md:flex-row gap-6">
        {/* ── ROSCO + STATS ─────────────────────────────────────────── */}
        <div className="flex-1 bg-gradient-to-b from-blue to-darkBlue rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex-1">
            <Rosco
              preguntas={estadoSala?.[`preguntas_${estadoSala.turno}`] || []}
              indiceActual={indice}
              started={turnConfirmed}
              player={estadoSala.turno}
            />
          </div>
          <div className="mt-4">
            <StatsMultiplayer
              player={estadoSala.turno}
              tiempoInicial={tiempoInicial}
              tiempoRestante={tiempoRestante}
              preguntas={estadoSala?.[`preguntas_${estadoSala.turno}`] || []}
              started={turnConfirmed}
              isTimerActive={esMiTurno}
              onExpire={pasarTurno}
              allowEdit={false}          // ← ya no permito edición

            />
          </div>
        </div>

        {/* ── PREGUNTA + CONTROLES (incluye confirmación) ──────────── */}
        <div className="flex-1 bg-gradient-to-b from-blue to-darkBlue rounded-2xl p-4 shadow-xl flex flex-col items-start">
          {/* Contenedor del estado del turno */}
          {estadoJuego === 'jugando' && !turnConfirmed && (
            <div className="w-full flex justify-center">
              <motion.div
                className="bg-darkBlue rounded-xl shadow-lg p-6 text-white transition-all duration-500 mt-4 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col gap-4 items-center text-center">
                  <div>
                    {esMiTurno ? (
                      <CheckCircleIcon className="h-10 w-10 text-green-400" />
                    ) : (
                      <ClockIcon className="h-10 w-10 text-yellow-300" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">
                    {esMiTurno ? '¡Tu turno ha comenzado!' : 'Esperando al oponente…'}
                  </h2>
                  <p className="text-sm text-white/80">
                    {esMiTurno
                      ? 'Pulsa el botón para confirmar y comenzar'
                      : `${nombreOponente} debe confirmar su turno`}
                  </p>
                  {esMiTurno && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={confirmarTurno}
                      className="classic-button mt-2 px-6 py-2 rounded text-white text-lg"
                    >
                      Comenzar mi turno
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Turno activo confirmado: muestro pregunta y controles */}
          {estadoJuego === 'jugando' && turnConfirmed && (
            <div className="w-full mt-4">
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
          )}
        </div>

      </div>
    </div>
  );
}
