// src/context/JuegoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import diccionario from '../data/diccionario.json';

const JuegoContext = createContext();
export const useJuego = () => useContext(JuegoContext);

export const JuegoProvider = ({ children }) => {
  const TIEMPO_DEFAULT = 180;
  const minTime = 1;      // tiempo mínimo en segundos
  const maxTime = 30;     // tiempo máximo en segundos (o el valor que quieras)

  // — Helper: genera un rosco nuevo a partir de diccionario.json —
  const generarRosco = () =>
    Object.entries(diccionario).map(([letra, entradas]) => {
      const idx = Math.floor(Math.random() * entradas.length);
      const { palabra, definicion } = entradas[idx];
      const lowerPal = palabra.toLowerCase();
      const modo = lowerPal.startsWith(letra.toLowerCase())
        ? 'inicia'
        : 'contiene';
      return { letra, palabra, definicion, modo, estado: 'pendiente' };
    });

  // — Estado del rosco (pre-generado al montar el Provider) —
  const [preguntas, setPreguntas]       = useState(() => generarRosco());
  const [indiceActual, setIndiceActual] = useState(0);

  // — Temporizador —
  const [tiempoInicial, setTiempoInicial]   = useState(TIEMPO_DEFAULT);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_DEFAULT);

  // — Flags de juego —
  const [started, setStarted] = useState(false);
  const [paused, setPaused]   = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Al cambiar tiempoInicial antes de empezar, resetea el contador
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

  // Arranca o reinicia partida con un rosco NUEVO
  const startGame = () => {
    const rosco = generarRosco();
    setPreguntas(rosco);
    setIndiceActual(0);
    setTiempoRestante(tiempoInicial);

    setStarted(true);
    setPaused(false);
    setGameOver(false);
  };

  // Busca el siguiente pendiente en modo circular
  const buscarSiguiente = (desde, arr) => {
    for (let i = 1; i <= arr.length; i++) {
      const ni = (desde + i) % arr.length;
      if (arr[ni].estado === 'pendiente') return ni;
    }
    return -1;
  };

  // Quita la pausa y avanza o reinicia vuelta si no hay pendientes
  const resumeGame = () => {
    const quedan = preguntas.some((p) => p.estado === 'pendiente');
    const huboP = preguntas.some((p) => p.estado === 'pasado');
    if (!quedan && huboP) {
      // reinicia pasados
      const rein = preguntas.map((p) =>
        p.estado === 'pasado' ? { ...p, estado: 'pendiente' } : p
      );
      setPreguntas(rein);
      const first = buscarSiguiente(-1, rein);
      if (first !== -1) setIndiceActual(first);
    } else {
      const next = buscarSiguiente(indiceActual, preguntas);
      if (next !== -1) setIndiceActual(next);
    }
    setPaused(false);
  };

  // Maneja ✔️ / ❌ / ⏭️
  const manejarRespuesta = (nuevoEstado) => {
    if (!started || gameOver) return;
    const updated = preguntas.map((p, i) =>
      i === indiceActual ? { ...p, estado: nuevoEstado } : p
    );
    setPreguntas(updated);

    if (nuevoEstado === 'incorrecto' || nuevoEstado === 'pasado') {
      setPaused(true);
      return;
    }

    const next = buscarSiguiente(indiceActual, updated);
    if (next !== -1) {
      setIndiceActual(next);
    } else {
      const huboP = updated.some((p) => p.estado === 'pasado');
      if (huboP) {
        const rein = updated.map((p) =>
          p.estado === 'pasado' ? { ...p, estado: 'pendiente' } : p
        );
        setPreguntas(rein);
        const first = buscarSiguiente(-1, rein);
        if (first !== -1) setIndiceActual(first);
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
        minTime,
        maxTime,
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