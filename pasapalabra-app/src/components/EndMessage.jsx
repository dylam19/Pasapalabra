// src/components/EndMessage.jsx
import React, { useState } from 'react';
import { useJuego } from '../context/JuegoContext';

const EndMessage = () => {
  const { preguntas, startGame } = useJuego();
  // Solo los pendientes
  const pendientes = preguntas.filter((p) => p.estado === 'pendiente' || p.estado === 'pasado');
  const total = pendientes.length;

  // Cada página será un solo pendiente
  const totalPages = total;
  const [page, setPage] = useState(0);

  // Si ya no hay pendientes, lo tratamos aparte
  if (total === 0) {
    return (  
      <div className="flex flex-col justify-between h-full p-6 bg-darkBlue rounded-lg 2x1 text-white select-none">
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">
            ¡Juego Finalizado!
          </h2>
          <p className="text-center font-bold text-green-300">
            ¡Felicidades! No quedaron palabras pendientes.
          </p>
        </div>
      </div>
    );
  }

  // La pregunta pendiente de esta “página”
  const { letra, palabra, definicion } = pendientes[page];
  const modo = palabra.startsWith(letra.toLowerCase())
        ? 'inicia'
        : 'contiene';

  return (
    <div className="flex flex-col justify-between h-full p-6 bg-transparent text-white">
      {/* 1) Header */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-2 select-none">
          ¡Juego Finalizado!
        </h2>
      </div>

      {/* 2) Contenido central: letra, palabra y definición */}
<div className="flex-1 flex items-center justify-center">
  <div
    className="
      bg-darkBlue rounded-lg p-6
      max-w-lg w-full
      text-center
      h-56            /* altura fija */
      flex flex-col justify-center
      overflow-auto   /* scroll si definición muy larga */
    "
  >
    <span className="block text-sm text-gray-400 mb-1 select-none">
      {modo === 'inicia'
          ? `Letra ${letra.toUpperCase()}`
          : `Contiene ${letra.toUpperCase()}`}
    </span>
    <h3 className="text-2xl font-bold mb-2">{palabra}</h3>
    <p className="text-base leading-relaxed">{definicion}</p>
  </div>
</div>


      {/* 3) Navegación + Nuevo Rosco al pie */}
      <div>
        {/* Prev / Next */}
        <div className="flex justify-center items-center space-x-4 mb-4 m-6 select-none">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-orange-600 rounded disabled:opacity-50"
          >
            « Anterior
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 bg-orange-600 rounded disabled:opacity-50"
          >
            Siguiente »
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndMessage;
