// src/components/multiplayer/CrearSala.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearSala } from '../../services/firebaseGameRTDB';

const CrearSala = ({ playerName }) => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCrearSala = async () => {
    if (!roomId) return;

    await crearSala(roomId, playerName, 'p1'); // crea la sala en Firebase
    navigate(`/sala/${roomId}/p1`);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-4 text-white">
      <div className='mb-8 bg-gradient-to-b from-blue to-darkBlue rounded-3xl px-8 py-4 shadow-lg text-center w-full max-w-lg'>
        <h2 className="text-2xl font-bold">Crear Sala</h2>

      </div>

      <input

        type="text"
        placeholder="ID de la sala"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-3 rounded-lg bg-white text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        onClick={handleCrearSala}
        className="classic-button  bg-green-600 rounded shadow hover:brightness-110"
      >
        Crear y Jugar
      </button>
    </div>
  );
};

export default CrearSala;
