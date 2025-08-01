// src/components/Stats.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useJuego } from '../context/JuegoContext'; // sigue importándolo
import TiempoSlider from './TiempoSlider';

const Stats = ({
  tiempoInicial: tiempoInicialExt,
  tiempoRestante: tiempoExt,
  puntaje: puntajeExt,
  onTimeChange,
  onConfirm,
  isTimerActive = true,
  onExpire = () => {},
  editable = true,
}) => {
  // ——— SOLO CLÁSICO: saco del contexto ———
  const contexto = (tiempoInicialExt == null && tiempoExt == null)
    ? useJuego()
    : {};
  const {
    tiempoRestante: ctxTimeRest = 0,
    tiempoInicial:  ctxTimeInit = 0,
    setTiempoInicial: ctxSetTime,
    preguntas = [],
    started = false,
  } = contexto;

  // Decide valores base y actual
  const baseTime    = tiempoInicialExt != null ? tiempoInicialExt : ctxTimeInit;
  const currentTime = tiempoExt        != null ? tiempoExt        : ctxTimeRest;

  // Número de aciertos
  const correctas = puntajeExt != null
    ? puntajeExt
    : preguntas.filter((p) => p.estado === 'correcto').length;

  // Cálculo del círculo
  const size = 90, center = size/2, radius = 36, strokeWidth = 4;
  const fraction = (started || tiempoExt != null)
    ? currentTime / baseTime
    : 1;
  const offset = (1 - fraction) * 2 * Math.PI * radius;

  // Slider sólo en pre-juego clásico (editable & !started)
  const showClassicSlider = editable && !started && tiempoExt == null;

  // Setup multijugador: sólo tiempoInicialExt, sin tiempoExt
  const isSetupMode = editable && tiempoInicialExt != null && tiempoExt == null;

  // Estado local para el botón settings (sólo en clásico)
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar editor al arrancar clásico
  useEffect(() => {
    if (started) setEditing(false);
  }, [started]);

  // En multijugador: si el timer está activo y llega a cero
  useEffect(() => {
    if (tiempoExt != null && isTimerActive && currentTime === 0) {
      onExpire();
    }
  }, [tiempoExt, currentTime, isTimerActive, onExpire]);

  return (
    <div
      className="md:mb-2 w-full px-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr min-content',
        alignItems: 'center',
      }}
    >
      {/* TIMER CIRCLE */}
      <div className="relative w-[90px] h-[90px]" ref={wrapperRef}>
        <svg width={size} height={size}>
          {/* defs omitidos */}
          <circle cx={center} cy={center} r={radius} fill="url(#timerGradient)" />
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#534C6FB0" strokeWidth={strokeWidth}/>
          <circle
            cx={center} cy={center} r={radius} fill="none"
            stroke="#686674B0" strokeWidth={strokeWidth}
            strokeDasharray={2*Math.PI*radius}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <text
            x={center} y={center} textAnchor="middle" dominantBaseline="middle"
            fill="#D7D5D9" fontSize="26" fontWeight="700" filter="url(#textShadow)"
          >
            {currentTime}
          </text>
        </svg>

        {/* SLIDER clásico */}
        {showClassicSlider && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <TiempoSlider
              min={30}
              max={400}
              initialTime={ctxTimeInit}
              onChange={ctxSetTime}
            />
          </div>
        )}

        {/* SLIDER multijugador (setup) */}
        {isSetupMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <TiempoSlider
              min={30}
              max={400}
              initialTime={tiempoInicialExt}
              onChange={onTimeChange}
            />
          </div>
        )}

        {/* BOTÓN de settings (clásico) o confirm (setup) */}
        {isSetupMode ? (
          <button
            className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2
                       bg-green-500 text-white px-4 py-1 rounded-full shadow-lg"
            onClick={onConfirm}
          >
            ¡Listo!
          </button>
        ) : (
          showClassicSlider && (
            <button
              className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2
                         p-2 rounded-full shadow-md text-xl text-[#D7D5D9]"
              onClick={() => setEditing((e) => !e)}
            >
              <span className="material-symbols-outlined">
                {editing ? 'check_circle' : 'settings'}
              </span>
            </button>
          )
        )}
      </div>

      {/* Spacer */}
      <div />

      {/* SCORE CIRCLE */}
      <div className="w-[80px] h-[80px]">
        <svg width={size} height={size}>
          {/* defs omitidos */}
          <circle cx={center} cy={center} r={radius} fill="url(#counterGradient)" />
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#534C6FB0" strokeWidth={strokeWidth}/>
          <text
            x={center} y={center} textAnchor="middle" dominantBaseline="middle"
            fill="#D7D5D9" fontSize="26" fontWeight="700" filter="url(#textShadow)"
          >
            {correctas}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Stats;
