import React from 'react';
import { useJuego } from '../context/JuegoContext';

const sonidoCorrecto = new Audio('/sounds/correcto.mp3');
const sonidoError = new Audio('/sounds/Error.mp3');
const sonidoPasado = new Audio('/sounds/pasapalabra.mp3');

const reproducirSonido = (tipo) => {
  if (tipo === 'correcto') sonidoCorrecto.play();
  if (tipo === 'incorrecto') sonidoError.play();
  if (tipo === 'pasado') sonidoPasado.play();
};

const Controles = ({ onResponder, disabled = false }) => {
  const { manejarRespuesta, gameOver } = useJuego();

  const handle = (tipo) => {
    reproducirSonido(tipo);

    if (onResponder) {
      onResponder(tipo); // multijugador
    } else {
      manejarRespuesta(tipo); // clásico
    }
  };

  const estaDeshabilitado = gameOver || disabled;
  const disabledCls = estaDeshabilitado
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:brightness-110';

  return (
    <div className="flex justify-center gap-4 mt-6 select-none">
      <button
        disabled={estaDeshabilitado}
        onClick={() => handle('correcto')}
        style={{
          background: 'linear-gradient(45deg, #3EDB98 0%, #37C450 100%)',
          border: '3px solid #686674B0',
        }}
        className={`text-white px-4 py-2 rounded shadow-xl transition ${disabledCls}`}
      >
        Correcto
      </button>

      <button
        disabled={estaDeshabilitado}
        onClick={() => handle('incorrecto')}
        style={{
          background: 'linear-gradient(45deg, #DA0924 0%, #B30011 100%)',
          border: '3px solid #686674B0',
        }}
        className={`text-white px-4 py-2 rounded shadow-xl transition ${disabledCls}`}
      >
        Incorrecto
      </button>

      <button
        disabled={estaDeshabilitado}
        onClick={() => handle('pasado')}
        style={{
          background: 'linear-gradient(45deg, #D5C94E 0%, #D59B1F 100%)',
          border: '3px solid #686674B0',
        }}
        className={`text-white px-4 py-2 rounded shadow-xl transition ${disabledCls}`}
      >
        Pasapalabra
      </button>
    </div>
  );
};

export default Controles;
