// src/components/multiplayer/CrearSala.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearSala } from '../../services/firebaseGame';

const CrearSala = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCrearSala = async () => {
    if (!roomId) return;

    await crearSala(roomId); // crea la sala en Firebase
    navigate(`/sala/${roomId}/p1`);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-4 text-white">
      <h2 className="text-2xl font-bold">Crear Sala</h2>
      <input
        type="text"
        placeholder="ID de la sala"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-2 rounded text-black"
      />
      <button
        onClick={handleCrearSala}
        className="px-6 py-2 bg-green-600 rounded shadow hover:brightness-110"
      >
        Crear y Jugar como P1
      </button>
    </div>
  );
};

export default CrearSala;
