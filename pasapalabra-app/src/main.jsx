// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './clasico/App.jsx'; // Modo clásico (con JuegoProvider)
import CrearSala from './components/multiplayer/CrearSala.jsx';
import UnirseASala from './components/multiplayer/UnirseASala.jsx';
import SalaMultijugador from './components/multiplayer/SalaMultijugador.jsx'; // vamos a crear
import HomeScreen from './components/screens/HomeScreen.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} /> {/* 👈 cambiá esto */}
        <Route path="/clasico" element={<App />} />
        <Route path="/crear" element={<CrearSala />} />
        <Route path="/unirse" element={<UnirseASala />} />
        <Route path="/sala/:roomId/:jugadorId" element={<SalaMultijugador />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);