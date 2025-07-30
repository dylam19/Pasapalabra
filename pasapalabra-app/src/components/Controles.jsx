import React from 'react';
import { useJuego } from '../context/JuegoContext';

const Controles = () => {
  const { manejarRespuesta, gameOver } = useJuego();

  const disabledCls = gameOver
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:brightness-110';

  return (
    <div className="flex justify-center gap-4 mt-6 select-none">
      <button
        disabled={gameOver}
        onClick={() => manejarRespuesta('correcto')}
        style={{ background: 'linear-gradient(45deg, #3EDB98 0%, #37C450 100%)', border: '3x solid #686674B0',}}
        className={` text-white px-4 py-2 rounded shadow-xl transition ${disabledCls}`}
      >
        Correcto
      </button>
      <button
        disabled={gameOver}
        onClick={() => manejarRespuesta('incorrecto')}
        style={{ background: 'linear-gradient(45deg, #DA0924 0%, #B30011 100%)', border: '3px solid #686674B0', }}
        className={`text-white px-4 py-2 rounded shadow-xl transition ${disabledCls}`}
      >
        Incorrecto
      </button>
      <button
        disabled={gameOver}
        onClick={() => manejarRespuesta('pasado')}
        style={{ background: 'linear-gradient(45deg, #D5C94E 0%, #D59B1F 100%)', border: '3px solid #686674B0', }}
        className={`text-white px-4 py-2 rounded shadow-xl transition ${disabledCls}`}
      >
        Pasapalabra
      </button>
    </div>
  );
};

export default Controles;
