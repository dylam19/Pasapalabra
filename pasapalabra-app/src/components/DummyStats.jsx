// src/components/DummyStats.jsx
import React from 'react';
import Stats from './Stats';
import { createContext, useContext } from 'react';

// Simulación de useJuego()
const DummyJuegoContext = createContext();

export const useJuego = () => useContext(DummyJuegoContext);

const DummyStats = () => {
  const mockData = {
    tiempoRestante: 120,
    tiempoInicial: 180,
    setTiempoInicial: () => {},
    started: true,
    preguntas: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map((letra, idx) => ({
      letra,
      estado: idx % 3 === 0 ? 'correcto' : idx % 3 === 1 ? 'incorrecto' : 'pendiente',
    }))
  };

  return (
    <DummyJuegoContext.Provider value={mockData}>
      <Stats />
    </DummyJuegoContext.Provider>
  );
};

export default DummyStats;
