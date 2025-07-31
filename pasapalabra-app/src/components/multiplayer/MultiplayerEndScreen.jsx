// src/components/multiplayer/MultiplayerEndScreen.jsx
import React from 'react';

const MultiplayerEndScreen = ({ puntajes }) => {
  if (!puntajes) {
    return (
      <div className="text-white text-center mt-10">
        Calculando resultados...
      </div>
    );
  }

  if (!estadoSala || !estadoSala.puntajes) {
  return <div className="text-white">Cargando sala...</div>;
  }

  const { p1 = 0, p2 = 0 } = puntajes;
  const resultado =
    p1 > p2 ? '¡Ganó el Jugador 1!' :
    p2 > p1 ? '¡Ganó el Jugador 2!' :
    '¡Empate!';

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-6 select-none">
      <h2 className="text-3xl font-bold mb-4">🏁 ¡Juego Finalizado!</h2>
      <div className="bg-darkBlue rounded-xl p-6 shadow-md w-full max-w-md text-center">
        <p className="text-xl mb-4">{resultado}</p>
        <div className="flex justify-around text-lg font-semibold">
          <div>Jugador 1: {p1} pts</div>
          <div>Jugador 2: {p2} pts</div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerEndScreen;
