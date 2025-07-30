// src/components/Pregunta.jsx
import React from 'react';
import { useJuego } from '../context/JuegoContext';

const Pregunta = () => {
  const { preguntas, indiceActual } = useJuego();
  const p = preguntas[indiceActual];
  if (!p) return null;

  const { letra, palabra, definicion, modo } = p;

  return (
    <div className="text-center mt-6 p-4 bg-darkBlue rounded shadow select-none">
      <h2 className="text-xl font-bold">
        {modo === 'inicia'
          ? `Letra ${letra}`
          : `Contiene ${letra}`}
      </h2>
      <h3 className="text-xl font-bold text-pink">Palabra: {palabra}</h3>
      <p className="mt-2">{definicion}</p>
    </div>
  );
};

export default Pregunta;
