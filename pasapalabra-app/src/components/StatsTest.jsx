// src/components/Stats.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useJuego } from '../context/JuegoContext';
import TiempoSlider from './TiempoSlider';

const Stats = ({
  // Multijugador Ready
  tiempoInicial: tiempoInicialExt = undefined,
  onTimeChange = () => {},
  onConfirm   = () => {},
  // Multijugador Playing
  tiempoRestante: tiempoExt = undefined,
  puntaje: puntajeExt       = undefined,
  isTimerActive = true,
  onExpire = () => {},
  // Clásico
  editable = true,
}) => {
  // Detectar modo
  const isReady   = tiempoInicialExt !== undefined && tiempoExt === undefined;
  const isPlaying = tiempoExt !== undefined;

  // Clásico: extraer del contexto
  const {
    tiempoInicial: ctxTimeInit,
    tiempoRestante: ctxTimeRest,
    setTiempoInicial: ctxSetTime,
    preguntas,
    started
  } = useJuego();

  // BaseTime y CurrentTime
  const baseTime    = isReady
    ? tiempoInicialExt
    : isPlaying
      ? tiempoInicialExt
      : ctxTimeInit;
  const currentTime = isPlaying
    ? tiempoExt
    : ctxTimeRest;

  // Cálculo aciertos
  const correctas = puntajeExt !== undefined
    ? puntajeExt
    : preguntas.filter(p => p.estado === 'correcto').length;

  // SVG params
  const size = 90;
  const center = size/2;
  const radius = 36;
  const strokeW = 4;
  const fraction = (started || isPlaying)
    ? currentTime / baseTime
    : 1;
  const offset = (1 - fraction) * 2 * Math.PI * radius;

  // Estado interno botón settings clásico
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar editor cuando arranca clásico
  useEffect(() => {
    if (started) setEditing(false);
  }, [started]);

  // Llamar onExpire en Playing
  useEffect(() => {
    if (isPlaying && isTimerActive && currentTime === 0) {
      onExpire();
    }
  }, [isPlaying, isTimerActive, currentTime, onExpire]);

  return (
    <div className="md:mb-2 w-full px-4"
         style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr min-content', alignItems: 'center' }}>
      
      {/* ─── TIMER ─── */}
      <div className="relative w-[90px] h-[90px]" ref={wrapperRef}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7D0038" />
              <stop offset="100%" stopColor="#D13B83" />
            </linearGradient>
            <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
            </filter>
          </defs>
          <circle cx={center} cy={center} r={radius} fill="url(#timerGradient)" />
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#534C6FB0" strokeWidth={strokeW} />
          {isPlaying && (
            <circle
              cx={center} cy={center} r={radius} fill="none"
              stroke="#686674B0" strokeWidth={strokeW}
              strokeDasharray={2 * Math.PI * radius}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${center} ${center})`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          )}
          <text
            x={center} y={center} textAnchor="middle" dominantBaseline="middle"
            fill="#D7D5D9" fontSize="26" fontFamily="'Ubuntu', sans-serif" fontWeight="700"
            filter="url(#textShadow)"
          >
            {isPlaying ? currentTime : baseTime}
          </text>
        </svg>
      </div>

      {/* ─── MIDDLE: Slider en Ready o Clásico ─── */}
      <div className="flex justify-center items-center">
        {isReady && (
          <TiempoSlider
            min={30} max={400}
            initialTime={tiempoInicialExt}
            onChange={onTimeChange}
          />
        )}
        {!isReady && !isPlaying && editable && !started && (
          <TiempoSlider
            min={30} max={400}
            initialTime={ctxTimeInit}
            onChange={ctxSetTime}
          />
        )}
      </div>

      {/* ─── BOTÓN: “Listo” o Settings ─── */}
      <div className="flex justify-center items-center">
        {isReady ? (
          <button
            className="bg-green-500 text-white px-4 py-1 rounded-full shadow-lg"
            onClick={onConfirm}
          >
            ¡Listo!
          </button>
        ) : (!isReady && !isPlaying && editable && !started) ? (
          <button
            onClick={() => setEditing(e => !e)}
            className="p-2 rounded-full shadow-md text-xl text-[#D7D5D9]"
          >
            <span className="material-symbols-outlined">
              {editing ? 'check_circle' : 'settings'}
            </span>
          </button>
        ) : null}
      </div>

      {/* ─── SCORE ─── */}
      <div className="w-[80px] h-[80px]">
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="counterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="30%" stopColor="#19124D" />
              <stop offset="100%" stopColor="#3f356eff" />
            </linearGradient>
            <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
            </filter>
          </defs>
          <circle cx={center} cy={center} r={radius} fill="url(#counterGradient)" />
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#534C6FB0" strokeWidth={strokeW} />
          <text
            x={center} y={center} textAnchor="middle" dominantBaseline="middle"
            fill="#D7D5D9" fontSize="26" fontFamily="'Ubuntu', sans-serif" fontWeight="700"
            filter="url(#textShadow)"
          >
            {correctas}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Stats;
