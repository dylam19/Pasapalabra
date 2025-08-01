// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './clasico/App.jsx'; // Modo clásico (con JuegoProvider)
import CrearSala from './components/multiplayer/CrearSala.jsx';
import UnirseASala from './components/multiplayer/UnirseASala.jsx';
import SalaMultijugador from './components/multiplayer/SalaMultijugador.jsx'; // vamos a crear
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="text-white text-center mt-10 space-y-4">
            <h1 className="text-4xl font-bold">Rospopalabra</h1>
            <p className="text-lg">Elige un modo de juego</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="/clasico" className="px-4 py-2 bg-pink-600 rounded shadow">Modo Clásico</a>
              <a href="/crear" className="px-4 py-2 bg-green-600 rounded shadow">Crear Sala</a>
              <a href="/unirse" className="px-4 py-2 bg-blue-600 rounded shadow">Unirse</a>
            </div>
          </div>
        } />
        <Route path="/clasico" element={<App />} />
        <Route path="/crear" element={<CrearSala />} />
        <Route path="/unirse" element={<UnirseASala />} />
        <Route path="/sala/:roomId/:jugadorId" element={<SalaMultijugador />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
