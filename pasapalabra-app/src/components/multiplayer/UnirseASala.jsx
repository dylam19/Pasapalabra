// src/components/UnirseASala.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSala, setNombreJugador } from '../../services/firebaseGameRTDB';

const UnirseASala = ({ playerName }) => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleUnirse = async () => {
    if (!roomId || !playerName.trim()) return;

    const sala = await obtenerSala(roomId);
    if (!sala) {
      alert('La sala no existe');
      return;
    }

    await setNombreJugador(roomId, 'p2', playerName,);
    navigate(`/sala/${roomId}/p2`);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-4 text-white">
      <div className='mb-8 bg-gradient-to-b from-blue to-darkBlue rounded-3xl px-8 py-4 shadow-lg text-center w-full max-w-lg'>
        <h2 className="text-2xl font-bold">Unirse a sala</h2>
      </div>
      <input
        type="text"
        placeholder="ID de la sala"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-2 rounded-lg bg-white text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        onClick={handleUnirse}
        className="classic-button bg-green-600 rounded shadow hover:brightness-110"
      >
        Unirse
      </button>
    </div>
  );
};

export default UnirseASala;
