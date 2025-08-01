// src/components/Jugar.jsx
import React from 'react';
import { useJuego } from '../context/JuegoContext';
import Pregunta from './Pregunta';
import Controles from './Controles';
import EndMessage from './EndMessage';

const Jugar = () => {
  const {
    started,
    paused,
    gameOver,
    startGame,
    resumeGame,
    manejarRespuesta,
  } = useJuego();

  // 1) Antes de arrancar
  if (!started) {
    return (
      
      <div className="flex justify-center mt-6 select-none">
        
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          Comenzar Rosco
        </button>
      </div>
    );
  }

  // 2) Pausa tras ❌ o ⏭️
  if (paused && !gameOver) {
    return (
      <div className="space-y-4 mt-6">
        {/* Mantenemos la definición visible */}
        <Pregunta />

        <div className="flex justify-center select-none">
          <button
            onClick={resumeGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // 3) Juego activo
  if (!gameOver) {
    return (
      <>
        <Pregunta />
        <Controles />
      </>
    );
  }

  // 4) Fin del juego
  return (
    <>
      <div className="mt-6">
        <EndMessage />
      </div>
      <div className="flex justify-center mt-6 select-none">
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded-lg shadow-md transition "
        >
          Nuevo Rosco
        </button>
      </div>
    </>
  );
};

export default Jugar;
