// src/components/UnirseASala.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSala } from '../../services/firebaseGame';

const UnirseASala = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleUnirse = async () => {
    if (!roomId) return;

    const sala = await obtenerSala(roomId);
    if (!sala) {
      alert('La sala no existe');
      return;
    }

    navigate(`/sala/${roomId}/jugador2`);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-4 text-white">
      <h2 className="text-2xl font-bold">Unirse a Sala</h2>
      <input
        type="text"
        placeholder="ID de la sala"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-2 rounded text-black"
      />
      <button
        onClick={handleUnirse}
        className="px-6 py-2 bg-blue-600 rounded shadow hover:brightness-110"
      >
        Unirme como Jugador 2
      </button>
    </div>
  );
};

export default UnirseASala;
