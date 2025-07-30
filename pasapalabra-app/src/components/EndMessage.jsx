// src/components/EndMessage.jsx
import React, { useState } from 'react';
import { useJuego } from '../context/JuegoContext';

const PAGE_SIZE = 8; // número de palabras por página

const EndMessage = () => {
  const { preguntas } = useJuego();
  // 1) Filtramos las que quedaron en estado 'pendiente'
  const pendientes = preguntas.filter((p) => p.estado === 'pendiente');

  // 2) Estado local para la paginación
  const [page, setPage] = useState(0);
  const total = pendientes.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 3) Rebanada de esta página
  const start = page * PAGE_SIZE;
  const slice  = pendientes.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-2xl font-bold text-center">¡Juego Finalizado!</h2>

      {total > 0 ? (
        <div className="space-y-4">
          <p className="text-center">Palabras que quedaron pendientes:</p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {slice.map((p, i) => (
              <li
                key={i}
                className="bg-gray-700 rounded-lg p-3 text-center"
              >
                <span className="block text-sm text-gray-400">
                  Letra {p.letra.toUpperCase()}
                </span>
                <span className="block font-semibold">{p.palabra}</span>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setPage((pg) => Math.max(0, pg - 1))}
                disabled={page === 0}
                className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
              >
                « Anterior
              </button>
              <span>
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage((pg) => Math.min(totalPages - 1, pg + 1))}
                disabled={page === totalPages - 1}
                className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
              >
                Siguiente »
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-green-400">
          ¡Felicidades, no quedaron pendientes!
        </p>
      )}
    </div>
  );
};

export default EndMessage;
