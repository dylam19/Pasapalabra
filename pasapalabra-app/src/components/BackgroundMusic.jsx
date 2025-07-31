// src/components/BackgroundMusic.jsx
import React, { useEffect, useRef } from 'react';
import { useJuego } from '../context/JuegoContext';

const BackgroundMusic = () => {
  const { started, paused, gameOver } = useJuego();
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (started && !paused && !gameOver) {
      // arrancar o reanudar
      audio.volume = 0.5;                    // ajusta el volumen
      audio.play().catch(() => {
        // en algunos navegadores requiere interacción previa
      });
    } else {
      // pausar y reiniciar al principio
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
