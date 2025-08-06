// src/components/Pregunta.jsx
import React from 'react';
import { useJuego } from '../context/JuegoContext';

const Pregunta = ({ pregunta, mostrarPalabra = true }) => {
  let p = null;

  try {
    const juego = useJuego?.();
    p = pregunta || (juego?.preguntas?.[juego?.indiceActual]);
  } catch (e) {
    p = pregunta || null;
  }

  if (!p) return null;

  const { letra, palabra, definicion, modo } = p;

  return (
    <div className="text-center mt-6 p-4 bg-darkBlue rounded-2xl shadow select-none">
      <h2 className="text-xl font-bold">
        {modo === 'inicia' ? `Letra ${letra}` : `Contiene ${letra}`}
      </h2>
      {mostrarPalabra && (
        <h3 className="text-xl font-bold text-pink">Palabra: {palabra}</h3>
      )}
      <p className="mt-2">{definicion}</p>
    </div>
  );
};

export default Pregunta;