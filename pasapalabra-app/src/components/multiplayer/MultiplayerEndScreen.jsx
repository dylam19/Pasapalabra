// src/components/multiplayer/MultiplayerEndScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MultiplayerEndScreen = ({ puntajes }) => {
const navigate = useNavigate();
  
const { p1 = 0, p2 = 0 } = puntajes || {};



  const ganador =
    p1 > p2 ? 'Jugador 1' :
    p2 > p1 ? 'Jugador 2' :
    'Empate';

  return (
    <div className="text-white text-center p-6 space-y-6">
      <h2 className="text-4xl font-bold">🎉 ¡Fin del juego! 🎉</h2>
      <h3 className="text-2xl">
        🏆 Resultado: <span className="text-pink-400 font-bold">{ganador}</span>
      </h3>

      <div className="text-lg space-y-1">
        <p>Jugador 1: {p1} aciertos</p>
        <p>Jugador 2: {p2} aciertos</p>
      </div>

      <div className="pt-4">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 px-6 py-2 rounded shadow hover:brightness-110"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default MultiplayerEndScreen;
