// src/components/multiplayer/EndScreen.jsx
import React from 'react';
import Rosco from '../../Rosco';

export default function EndScreen({ preguntas_p1, preguntas_p2, puntajes }) {
  // Decide el ganador
  const { p1, p2 } = puntajes;
  let resultado;
  if (p1 > p2) resultado = '¡Gana Jugador 1!';
  else if (p2 > p1) resultado = '¡Gana Jugador 2!';
  else resultado = '¡Empate!';

  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      <header className="text-center mb-6">
        <h2 className="text-4xl font-bold">Fin de la Partida</h2>
        <p className="text-2xl mt-2">{resultado}</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Rosco final de ambos jugadores */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl">
          <h3 className="text-xl mb-2">Rosco Jugador 1</h3>
          <Rosco preguntas={preguntas_p1} />
        </div>
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl">
          <h3 className="text-xl mb-2">Rosco Jugador 2</h3>
          <Rosco preguntas={preguntas_p2} />
        </div>

        {/* Resumen de puntajes */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center">
          <h3 className="text-2xl mb-4">Puntajes Finales</h3>
          <p className="text-xl">Jugador 1: {p1}</p>
          <p className="text-xl">Jugador 2: {p2}</p>
        </div>
      </div>
    </div>
  );
}
