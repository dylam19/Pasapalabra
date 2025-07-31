// src/components/Stats.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useJuego } from '../context/JuegoContext';

const Stats = () => {
  const {
    tiempoRestante,
    tiempoInicial,
    setTiempoInicial,
    preguntas,
    started,
  } = useJuego();

  const correctas = preguntas.filter((p) => p.estado === 'correcto').length;

  // Parámetros del SVG
  const size = 90;
  const center = size / 2;
  const radius = 36;
  const strokeWidth = 4;

  // Límites para el slider
  const minTime = 30;
  const maxTime = 300;
  // Parámetros del anillo exterior
  const outerRadius = radius;
  const outerStroke = 4;
  const outerCirc = 2 * Math.PI * outerRadius;

  // Progreso del timer
  const fraction = started ? tiempoRestante / tiempoInicial : 1;
  const offset = (1 - fraction) * 2 * Math.PI * radius;

  // Para dibujar el handle del slider
  const sliderFrac = (tiempoInicial - minTime) / (maxTime - minTime);
  const sliderAngle = sliderFrac * 360 - 90;
  const sliderRad = (sliderAngle * Math.PI) / 180;
  const handleX = center + outerRadius * Math.cos(sliderRad);
  const handleY = center + outerRadius * Math.sin(sliderRad);

  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wrapperRef = useRef(null);

  // Cuando arranca el juego, cerramos cualquier modo edición/drag
  useEffect(() => {
    if (started) {
      setEditing(false);
      setDragging(false);
    }
  }, [started]);

  const lastAngleRef = useRef(null);

  // Evento global para arrastrar el handle
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging || !editing) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const cx = rect.left + center;
      const cy = rect.top + center;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      let ang = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (ang < 0) ang += 360;

      // Prevención de saltos al pasar de 360° a 0°
      if (lastAngleRef.current !== null) {
        const diff = Math.abs(ang - lastAngleRef.current);
        if (diff > 180) return; // salto brusco = ignorar
      }
      lastAngleRef.current = ang;

      const frac = ang / 360;
      let newTime = Math.round(minTime + frac * (maxTime - minTime));

      // Snapping
      const snapRange = 5;
      if (newTime >= maxTime - snapRange) newTime = maxTime;
      if (newTime <= minTime + snapRange) newTime = minTime;

      setTiempoInicial(Math.min(maxTime, Math.max(minTime, newTime)));
    };

    const onUp = () => {
      if (dragging) setDragging(false);
      lastAngleRef.current = null;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, editing, setTiempoInicial]);

  const displayTime = started ? tiempoRestante : tiempoInicial;

  return (
    <div
      className="md:mb-2 w-full px-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr min-content',
        alignItems: 'center',
      }}
    >
      {/** CELDA 1: TIMER **/}
      <div
        className="relative w-[80px] h-[80px]"
        ref={wrapperRef}
      >
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7D0038" />
              <stop offset="100%" stopColor="#D13B83" />
            </linearGradient>
            <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
            </filter>
            <linearGradient id="sliderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D13B83" />
              <stop offset="100%" stopColor="#7D0038" />
            </linearGradient>
          </defs>

          {/* Fondo degradé */}
          <circle cx={center} cy={center} r={radius} fill="url(#timerGradient)" />

          {/* Track gris */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="#534C6FB0" strokeWidth={strokeWidth}
          />

          {/* Progreso */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke="#686674B0" strokeWidth={strokeWidth}
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />

          {/* Texto centrado */}
          <text
            x={center} y={center}
            textAnchor="middle" dominantBaseline="middle"
            fill="#D7D5D9" fontSize="26"
            fontFamily="'Ubuntu', sans-serif" fontWeight="700"
            filter="url(#textShadow)"
          >
            {displayTime}
          </text>

          {/* Slider radial (modo edición) */}
          {editing && !started && (
            <>
                {/* Track exterior gris */}
                <circle
                  cx={center}
                  cy={center}
                  r={outerRadius}
                  fill="none"
                  stroke="#555"
                  strokeWidth={outerStroke}
                />
                {/* Progreso exterior de slider */}
                <circle
                  cx={center}
                  cy={center}
                  r={outerRadius}
                  fill="none"
                  stroke="url(#sliderGradient)"
                  strokeWidth={outerStroke}
                  strokeDasharray={outerCirc}
                  strokeDashoffset={outerCirc * (1 - sliderFrac)}
                  transform={`rotate(-90 ${center} ${center})`}
                />
                {/* Handle (drag knob) */}
                <circle
                  cx={handleX}
                  cy={handleY}
                  r={6}
                  fill="#fff"
                  stroke="#D13B83"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', touchAction: 'none' }}
                  onPointerDown={() => setDragging(true)}
                />
              </>
          )}
        </svg>
      </div>

      {/** CELDA 2: BOTÓN ⚙️ (o espacio vacío) **/}
      <div style={{ justifySelf: 'center' }}>
        {!started && (
          <button
            onClick={() => setEditing((e) => !e)}
            className="p-2 rounded-full shadow-md text-xl">
          {editing 
            ? <span className="material-symbols-outlined text-[#fff]">
                check_circle
              </span>
            : <span className="material-symbols-outlined text-[#fff]">
                settings
              </span>
          }
          </button>
        )}
      </div>


      {/** CELDA 3: CONTADOR DE ACIERTOS **/}
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
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="#534C6FB0" strokeWidth={strokeWidth}
          />
          <text
            x={center} y={center}
            textAnchor="middle" dominantBaseline="middle"
            fill="#D7D5D9" fontSize="26"
            fontFamily="'Ubuntu', sans-serif" fontWeight="700"
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
