// src/context/JuegoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import diccionario from '../data/diccionario.json';

const JuegoContext = createContext();
export const useJuego = () => useContext(JuegoContext);

export const JuegoProvider = ({ children }) => {
  const TIEMPO_DEFAULT = 180;

  // Estado del rosco
  const [preguntas, setPreguntas]         = useState([]);
  const [indiceActual, setIndiceActual]   = useState(0);

  // Temporizador
  const [tiempoInicial, setTiempoInicial] = useState(TIEMPO_DEFAULT);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_DEFAULT);

  // Flags de juego
  const [started, setStarted] = useState(false);
  const [paused, setPaused]   = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Resetea el contador si cambias tiempoInicial antes de empezar
  useEffect(() => {
    if (!started) setTiempoRestante(tiempoInicial);
  }, [tiempoInicial, started]);

  // Cronómetro (respeta paused y gameOver)
  useEffect(() => {
    if (!started || paused || gameOver) return;
    const timer = setInterval(() => {
      setTiempoRestante((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, paused, gameOver]);

  // Helper: genera un rosco nuevo a partir de tu diccionario.json
  const generarRosco = () => {
    return Object.entries(diccionario).map(([letra, entradas]) => {
      const idx = Math.floor(Math.random() * entradas.length);
      const { palabra, definicion } = entradas[idx];
      return { letra, palabra, definicion, estado: 'pendiente' };
    });
  };

  // Inicia o reinicia el juego con un rosco nuevo
  const startGame = () => {
    const rosco = generarRosco();
    setPreguntas(rosco);
    setIndiceActual(0);
    setTiempoRestante(tiempoInicial);
    setStarted(true);
    setPaused(false);
    setGameOver(false);
  };

  // Reanudar tras pausa (mal o pasapalabra)
  const resumeGame = () => {
    setPaused(false);
    const next = preguntas.findIndex((p) => p.estado === 'pendiente');
    if (next !== -1) setIndiceActual(next);
  };

  // Maneja pausa/vuelta/fin de juego
  const manejarRespuesta = (nuevoEstado) => {
    if (!started || gameOver) return;

    const updated = preguntas.map((p, i) =>
      i === indiceActual ? { ...p, estado: nuevoEstado } : p
    );
    setPreguntas(updated);

    // Pausar si fue incorrecto o pasapalabra
    if (nuevoEstado === 'incorrecto' || nuevoEstado === 'pasado') {
      setPaused(true);
      return;
    }

    // Avanzar o, si acabó la vuelta, reiniciar los pasados
    const quedan = updated.some((p) => p.estado === 'pendiente');
    if (quedan) {
      setIndiceActual(updated.findIndex((p) => p.estado === 'pendiente'));
    } else {
      const huboPas = updated.some((p) => p.estado === 'pasado');
      if (huboPas) {
        const reinicio = updated.map((p) =>
          p.estado === 'pasado' ? { ...p, estado: 'pendiente' } : p
        );
        setPreguntas(reinicio);
        setIndiceActual(reinicio.findIndex((p) => p.estado === 'pendiente'));
      } else {
        setGameOver(true);
      }
    }
  };

  return (
    <JuegoContext.Provider
      value={{
        preguntas,
        indiceActual,
        tiempoInicial,
        setTiempoInicial,
        tiempoRestante,
        started,
        paused,
        gameOver,
        startGame,
        resumeGame,
        manejarRespuesta,
      }}
    >
      {children}
    </JuegoContext.Provider>
  );
};
