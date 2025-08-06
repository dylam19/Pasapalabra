// src/components/multiplayer/EndScreen.jsx
import React, { useState } from 'react';
import Rosco from '../../Rosco';
import EndMessage from '../../EndMessage';
import { useMultiplayer } from '../../../context/MultiplayerContext'
import StatsMultiplayer from '../StatsMultiplayer';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import HeaderRosco from '../../HeaderRosco';

export default function EndScreen({ preguntas_p1, preguntas_p2, puntajes }) {
  // 0) Estado local para saber qué jugador mostrar
  const [player, setPlayer] = useState('p1');
  const preguntas = player === 'p1' ? preguntas_p1 : preguntas_p2;
  const { reiniciarSala, estadoSala } = useMultiplayer();
  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      {HeaderRosco()}
      <div key={player} className="flex flex-col md:flex-row gap-4">
        {/* ─── ZONA IZQUIERDA: ROSCO + FLECHAS ───────────────────────────── */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <button
            onClick={() => setPlayer(player === 'p1' ? 'p2' : 'p1')}
            className="side-button text-3xl font-bold select-none"
          >
            <ChevronLeftIcon style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>

          <div className="flex-1 mx-4">
            <Rosco
              preguntas={preguntas}
              started={true}
              player={player}
            />
            <StatsMultiplayer
              player={player}             // fuerza remount cuando cambia player
              tiempoInicial={estadoSala.tiempos[player]}
              tiempoRestante={0}
              preguntas={preguntas}
              started={true}
              isTimerActive={false}
              allowEdit={false}
            />
          </div>

          <button
            onClick={() => setPlayer(player === 'p1' ? 'p2' : 'p1')}
            className="side-button text-3xl font-bold select-none"
          >
            <ChevronRightIcon style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>
        </div>

        {/* ─── ZONA DERECHA: RESULTADOS Y PENDIENTES ─────────────────────── */}
        <div className="flex-1 bg-darkBlue rounded-2xl shadow-xl p-4 flex flex-col justify-between">
          <EndMessage preguntas={preguntas} puntajes={puntajes} />
          <div className="flex justify-center mt-6 select-none">
            <button
              onClick={reiniciarSala}
              className=" classic-button text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              Nuevo Rosco
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}