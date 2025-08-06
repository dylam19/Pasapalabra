import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Modal from './../Modal';
import CrearSala from './../multiplayer/CrearSala';
import UnirseASala from './../multiplayer/UnirseASala';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeScreen() {
  const navigate = useNavigate();

  const [showMultiplayerOptions, setShowMultiplayerOptions] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showCrearSalaModal, setShowCrearSalaModal] = useState(false);
  const [showUnirseModal, setShowUnirseModal] = useState(false);
  const [showNameError, setShowNameError] = useState(false);

  const isPlayerNameValid = playerName.trim().length >= 2;

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) setPlayerName(storedName);
  }, []);

  useEffect(() => {
    localStorage.setItem('playerName', playerName);
  }, [playerName]);

  const toggleMultiplayer = () => setShowMultiplayerOptions(prev => !prev);
  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
    if (showNameError && e.target.value.trim().length >= 2) {
      setShowNameError(false);
    }
  };

  const handleCrearSalaClick = () => {
    if (!isPlayerNameValid) return setShowNameError(true);
    setShowCrearSalaModal(true);
  };

  const handleUnirseClick = () => {
    if (!isPlayerNameValid) return setShowNameError(true);
    setShowUnirseModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#EB0B92] to-[#4B57B0] text-white relative">
      
      {/* Header con animación */}
      <motion.header
        className="mb-8 bg-gradient-to-b from-blue to-darkBlue rounded-3xl px-8 py-4 shadow-lg text-center w-full max-w-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          className="text-4xl font-bold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          Rospopalabra
        </motion.h1>
      </motion.header>

      {/* Contenedor de botones */}
      <motion.div
        className="flex flex-col items-center gap-4 w-full max-w-xs"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {/* Botón clásico */}
        <button
          onClick={() => navigate('/clasico')}
          className="w-full py-3 px-6 bg-pink-600 hover:bg-pink-700 text-lg font-semibold rounded-3xl shadow"
        >
          Modo Clásico
        </button>

        {/* Botón multijugador */}
        <div className="relative w-full">
          <button
            onClick={toggleMultiplayer}
            className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 text-lg font-semibold rounded-3xl shadow flex items-center justify-center"
          >
            Multijugador
            <span className={`transition-transform ${showMultiplayerOptions ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDownIcon className="w-5 h-5 ml-2 text-white" />
            </span>
          </button>

          {/* Subopciones animadas */}
          <AnimatePresence>
            {showMultiplayerOptions && (
              <motion.div
                key="multiplayer-options"
                className="absolute top-full mt-2 left-0 right-0 bg-white p-4 rounded-xl shadow-xl z-10 text-gray-900"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Input de nombre */}
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Nombre de Jugador</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      placeholder="..."
                      value={playerName}
                      onChange={handleNameChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  {showNameError && (
                    <p className="text-sm text-red-500 mt-1">Debe tener al menos 2 caracteres</p>
                  )}
                </div>
                
                {/* Botón Crear Sala */}
                <button
                  onClick={handleCrearSalaClick}
                  className={`w-full py-2 px-5 rounded-2xl shadow text-md font-medium mb-2 ${
                    isPlayerNameValid ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-400 text-white cursor-not-allowed'
                  }`}
                >
                  Crear Sala
                </button>

                {/* Botón Unirse */}
                <button
                  onClick={handleUnirseClick}
                  className={`w-full py-2 px-5 rounded-2xl shadow text-md font-medium ${
                    isPlayerNameValid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-400 text-white cursor-not-allowed'
                  }`}
                >
                  Unirse
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modales */}
      <Modal show={showCrearSalaModal} onClose={() => setShowCrearSalaModal(false)}>
        <CrearSala playerName={playerName} />
      </Modal>

      <Modal show={showUnirseModal} onClose={() => setShowUnirseModal(false)}>
        <UnirseASala playerName={playerName} />
      </Modal>
    </div>
  );
}
