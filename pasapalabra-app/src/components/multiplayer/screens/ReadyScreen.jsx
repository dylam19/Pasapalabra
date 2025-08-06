import React from 'react';
import Rosco from '../../Rosco';
import StatsMultiplayer from '../StatsMultiplayer';
import HeaderRosco from '../../HeaderRosco';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReadyScreen({
  preguntasPropias,
  tiempoInicial,
  setTiempoInicial,
  onConfirmReady
}) {
  const { estadoSala, jugadorId } = useMultiplayer();

  const nombres = estadoSala?.nombres || {};
  const listo = estadoSala?.listo || {};

  const jugadores = [
    { id: 'p1', nombre: nombres.p1 || 'Jugador 1', listo: listo.p1 },
    { id: 'p2', nombre: nombres.p2 || 'Jugador 2', listo: listo.p2 }
  ];

  const estaListo = (jugador) => listo?.[jugador] === true;

  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      {HeaderRosco()}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Columna izquierda: Rosco + Stats */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex-1">
            <Rosco preguntas={preguntasPropias} />
          </div>
          <div className="mt-4">
            <StatsMultiplayer
              tiempoInicial={tiempoInicial}
              setTiempoInicial={setTiempoInicial}
              preguntas={preguntasPropias}
              started={false}
              allowEdit={!estaListo(jugadorId)}
            />
          </div>
        </div>

        {/* Columna derecha: Estados + Botón “Listo” */}
        <motion.div
          className="flex-1 bg-darkBlue rounded-2xl shadow-xl p-4 flex flex-col text-center gap-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Estados de jugadores */}
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {jugadores.map((jug) => {
                const estaListoJugador = estaListo(jug.id);
                const esPropio = jug.id === jugadorId;

                const baseColor = jug.id === 'p1'
                  ? 'from-[#322a70] to-[#17144A]'
                  : 'from-[#322a70] to-[#CC6F23]';

                return (
                  <motion.div
                    key={jug.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: jug.id === 'p1' ? 0.1 : 0.2 }}
                  >
                    <div
                      className={`flex items-center justify-between px-4 py-3 rounded-xl shadow transition-all duration-500
                            ${estaListoJugador ? 'bg-gradient-to-r from-green-700 to-green-600' : `bg-gradient-to-r ${baseColor}`}`}
                    >
                      <div className="flex items-center gap-2 text-left w-full">
                        {/* Ícono animado suavemente sin desmontar */}
                        <motion.div
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          {estaListoJugador ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-300 transition-all duration-300" />
                          ) : (
                            <ClockIcon className="h-6 w-6 text-purple-300 transition-all duration-300" />
                          )}
                        </motion.div>

                        {/* Info de jugador */}
                        <div className="flex-1">
                          <p className="font-bold flex gap-2 items-center">
                            <span>{jug.nombre}</span>
                            {esPropio && (
                              <span className="text-sm text-gray-300 font-normal">(vos)</span>
                            )}
                          </p>

                          <motion.p
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-white/80 transition-colors duration-300"
                          >
                            {estaListoJugador ? 'Listo' : 'Esperando...'}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

            </AnimatePresence>
          </div>

          {/* Botón “Listo” */}
          <p className="text-md text-white/80">
            Selecciona tu tiempo y pulsa “Listo” para continuar
          </p>

          <motion.button
            onClick={onConfirmReady}
            whileHover={estaListo(jugadorId) ? false : { scale: 1.01 }}
            whileTap={estaListo(jugadorId) ? false : { scale: 0.95 }}
            className={`classic-button mt-2 px-6 py-2 rounded text-white text-lg transition ${estaListo(jugadorId) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            ¡Listo!
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
