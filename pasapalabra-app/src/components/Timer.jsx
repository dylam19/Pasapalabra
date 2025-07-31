import React from 'react';
import { useJuego } from '../context/JuegoContext';

const Timer = () => {
  let tiempoRestante = 0;
  let gameOver = false;

  try {
    const juego = useJuego?.();
    if (juego) {
      tiempoRestante = juego.tiempoRestante ?? 0;
      gameOver = juego.gameOver ?? false;
    }
  } catch {}

  const minutes = String(Math.floor(tiempoRestante / 60)).padStart(2, '0');
  const seconds = String(tiempoRestante % 60).padStart(2, '0');

  return (
    <div
      className={`text-center text-2xl font-mono ${
        gameOver ? 'text-gray-400' : 'text-yellow-300 animate-pulse'
      }`}
    >
      {minutes}:{seconds}
    </div>
  );
};

export default Timer;