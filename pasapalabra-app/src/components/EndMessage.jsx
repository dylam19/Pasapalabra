import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const EndMessage = ({ preguntas = [], puntajes }) => {
  const mostrarResultados = Boolean(puntajes);

  const pendientes = preguntas.filter(
    (p) => p.estado === 'pendiente' || p.estado === 'pasado'
  );

  const total = pendientes.length;
  const totalPages = total - 1;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 sube, +1 baja

  const subir = () => {
    setDirection(-1);
    setPage((p) => Math.max(0, p - 1));
  };

  const bajar = () => {
    setDirection(1);
    setPage((p) => Math.min(totalPages - 1, p + 1));
  };

  const capitalizeFirst = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const renderPreguntaBase = (pregunta, idx, position) => {
    const letter = pregunta?.letra?.toUpperCase() ?? '';
    const palabra = pregunta?.palabra ?? '';
    const definicion = pregunta?.definicion ?? '';

    const borderClass =
      position === 'top'
        ? 'rounded-t-3xl'
        : position === 'bottom'
          ? 'rounded-b-3xl'
          : '';

    const borderClassLetter =
      position === 'top'
        ? 'rounded-tl-3xl'
        : position === 'bottom'
          ? 'rounded-bl-3xl'
          : '';

    return (
      <div key={`${position}-${idx}`} className="relative mb-1 flex items-center">
        <div
          className={`flex-1 min-h-23 flex overflow-hidden bg-gradient-to-br from-[#771179] to-[#59075C] shadow-lg ${borderClass}`}
        >
          {/* BLOQUE FIJO: LETRA */}
          <div
            className={`bg-gradient-to-br from-[#C3116B] to-[#9E0C55] w-20 flex items-center justify-center text-white text-5xl font-bold ${borderClassLetter}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${palabra}-${position}`}
                initial={{ opacity: 0, y: direction === 1 ? 50 : -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction === 1 ? -50 : 50 }}
                transition={{ duration: 0.5 }}
              >
                <div>{letter}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BLOQUE ANIMADO: PALABRA + DEFINICIÓN */}
          <div className="flex-1 p-2 text-white relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${palabra}-${position}`}
                initial={{ opacity: 1, y: direction === 1 ? 160 : -160 }}
                animate={{ opacity: 1, y: 1 }}
                exit={{ opacity: 1, y: direction === 1 ? -160 : 160 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-sm">{capitalizeFirst(palabra)}</div>
                <div className="text-white/80 leading-relaxed">{definicion}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Flechas */}
        {position === 'top' && page > 0 && (
          <button
            onClick={subir}
            className="chevron-button"
            style={{
              position: 'absolute',
              right: '-0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '10px',
              borderRadius: '9999px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              border: 'none',
              zIndex: 999,
              cursor: 'pointer',
            }}
          >
            <ChevronUpIcon style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>
        )}

        {position === 'bottom' && page + 1 < totalPages && (
          <button
            onClick={bajar}
            className="chevron-button"
            style={{
              position: 'absolute',
              right: '-0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '10px',
              borderRadius: '9999px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              border: 'none',
              zIndex: 999,
              cursor: 'pointer',
            }}
          >
            <ChevronDownIcon style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>
        )}
      </div>
    );
  };


  return (
    <div className="flex flex-col justify-between h-full bg-transparent text-white relative">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-4 select-none">
          ¡Juego Finalizado!
        </h2>
      </div>

      {/* Contenido */}
      <div className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {renderPreguntaBase(pendientes[page], page, 'top')}
          {renderPreguntaBase(pendientes[page + 1], page + 1, 'bottom')}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EndMessage;
