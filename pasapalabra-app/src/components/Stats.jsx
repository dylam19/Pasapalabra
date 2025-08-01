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

  // Contexto clásico
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
  const tiempoActual = isPlaying
    ? tiempoExt
    : ctxTimeRest;

  // Número de aciertos: o viene por prop, o lo calculo desde el contexto
  const correctas =
    puntajeExt ??
    preguntas.filter((p) => p.estado === 'correcto').length;

  // Parámetros del círculo
  const size = 90;
  const center = size / 2;
  const radius = 36;
  const strokeWidth = 4;

  const minTime = 30;
  const maxTime = 400;

  // Fracción para el dashoffset
  const fraction = started || tiempoExt != null
    ? tiempoActual / tiempoBase
    : 1;
  const offset = (1 - fraction) * 2 * Math.PI * radius;

  // Estado local para el botón de editar
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);

  // Cierro el editor al iniciar el clásico
  useEffect(() => {
    if (started) setEditing(false);
  }, [started]);

  // En multijugador: si el timer está activo y llega a cero, llamo a onExpire()
  useEffect(() => {
    if (tiempoExt != null && isTimerActive && tiempoActual === 0) {
      onExpire();
    }
  }, [tiempoExt, tiempoActual, isTimerActive, onExpire]);

  return (
    <div
      className="md:mb-2 w-full px-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr min-content',
        alignItems: 'center',
      }}
    >
      {/* TIMER */}
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
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#534C6FB0" strokeWidth={strokeWidth} />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#686674B0"
            strokeWidth={strokeWidth}
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#D7D5D9"
            fontSize="26"
            fontFamily="'Ubuntu', sans-serif"
            fontWeight="700"
            filter="url(#textShadow)"
          >
            {tiempoActual}
          </text>
        </svg>

        {/* SLIDER sólo en modo clásico (editable & no started) */}

        {isReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <TiempoSlider
              min={30} max={400}
              initialTime={tiempoInicialExt}
              onChange={onTimeChange}
            />
          </div>
        )}
        {!isReady && !isPlaying && editable && !started && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <TiempoSlider
              min={30} max={400}
              initialTime={ctxTimeInit}
              onChange={ctxSetTime}
            />
          </div>
        )}

      </div>

      {/* BOTÓN DE AJUSTE sólo en clásico */}
      <div style={{ justifySelf: 'center' }}>
        {editable && !started && (
          <button
            onClick={() => setEditing((e) => !e)}
            className="p-2 rounded-full shadow-md text-xl"
          >
            {editing ? (
              <span className="material-symbols-outlined text-[#D7D5D9]">check_circle</span>
            ) : (
              <span className="material-symbols-outlined text-[#D7D5D9]">settings</span>
            )}
          </button>
        )}
      </div>

      {/* CONTADOR DE ACIERTOS */}
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
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#534C6FB0" strokeWidth={strokeWidth} />
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#D7D5D9"
            fontSize="26"
            fontFamily="'Ubuntu', sans-serif"
            fontWeight="700"
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
