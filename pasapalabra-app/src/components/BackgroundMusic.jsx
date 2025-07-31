import React, { useEffect, useRef } from 'react';
import { useJuego } from '../context/JuegoContext';

const sonidoError = new Audio('/sounds/Error.mp3');

const BackgroundMusic = () => {
  const audioRef = useRef(null);

  let started = false;
  let paused = false;
  let gameOver = false;

  try {
    const juego = useJuego?.();
    if (juego) {
      started = juego.started ?? false;
      paused = juego.paused ?? false;
      gameOver = juego.gameOver ?? false;
    }
  } catch {}

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (started && !paused && !gameOver) {
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } else {
      if (gameOver) {
        sonidoError.play();
      }
      audio.pause();
      audio.currentTime = 0;
    }
  }, [started, paused, gameOver]);

  return (
    <audio
      ref={audioRef}
      src="/sounds/MusicaRosco.mp3"
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default BackgroundMusic;