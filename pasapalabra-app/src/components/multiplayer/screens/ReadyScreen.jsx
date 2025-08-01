// src/components/multiplayer/ReadyScreen.jsx
import React from 'react';
import Rosco from '../../Rosco';
import Stats from '../StatsMultiplayer';

export default function ReadyScreen({ 
  tiempoInicial,      // number: viene de Firestore
  setTiempoInicial,   // fn: actualiza en Firestore
  puntajePropio,      // número (será 0 al principio)
  onConfirmReady      // fn: marca listo en Firestore
}) {
  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0]">
      <header className="text-center mb-4">
        <h2 className="text-3xl font-bold">¡Ambos conectados!</h2>
        <p className="text-lg">Ajusta el tiempo y confirma cuando estés listo</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Columna izquierda: Rosco + Stats (modo clásico) */}
        <div className="flex-1 bg-darkBlue rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex-1">
            <Rosco />
          </div>
          <div className="mt-4">
            {/* editable=true fuerza slider+settings */}
            <StatsMultiplayer
              tiempoInicial={tiempoInicial}
              setTiempoInicial={setTiempoInicial}
              preguntas={preguntasPropias}
              started={false}
            />
          </div>
        </div>

        {/* Columna derecha: botón “Listo” */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onConfirmReady}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg"
          >
            ¡Listo!
          </button>
        </div>
      </div>
    </div>
  );
}
