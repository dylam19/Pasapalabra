// src/components/multiplayer/EndScreen.jsx
import React, { useState } from 'react';                             
import Rosco from '../../Rosco';
import EndMessage from '../../EndMessage';
import {useMultiplayer} from '../../../context/MultiplayerContext'

export default function EndScreen({ preguntas_p1, preguntas_p2, puntajes }) {
  // 0) Estado local para saber qué jugador mostrar
  const [player, setPlayer] = useState('p1');
  const preguntas = player === 'p1' ? preguntas_p1 : preguntas_p2;
  const {iniciarJuego} = useMultiplayer();  
  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      <header className="text-center mb-6">
        <h2 className="text-4xl font-bold">Fin de la Partida</h2>
        {/* Puedes mantener el mensaje de ganador aquí */}
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ─── ZONA IZQUIERDA: ROSCO + FLECHAS ───────────────────────────── */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <button
            onClick={() => setPlayer(player === 'p1' ? 'p2' : 'p1')}
            className="text-3xl font-bold select-none"
          >
            ‹
          </button>

          <div className="flex-1 mx-4">
            <Rosco preguntas={preguntas} player={player}/>
          </div>

          <button
            onClick={() => setPlayer(player === 'p1' ? 'p2' : 'p1')}
            className="text-3xl font-bold select-none"
          >
            ›
          </button>
        </div>

        {/* ─── ZONA DERECHA: RESULTADOS Y PENDIENTES ─────────────────────── */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 2) Pendientes dinámicos */}
          <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl overflow-auto">
            <EndMessage preguntas={preguntas} puntajes={puntajes} />

          <div className="flex justify-center mt-6 select-none">
            <button
              onClick={iniciarJuego}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded-lg shadow-md transition ">
              Nuevo Rosco
            </button>
          </div>

          </div>

        </div>
      </div>
    </div>
  );
}
