// src/components/Rosco.jsx
import React from 'react';
import { useJuego } from '../context/JuegoContext';

const Rosco = ({ preguntas: preguntasProp, indiceActual: indiceProp, started: startedProp }) => {
  let juego;
  try {
    juego = useJuego?.();
  } catch (e) {
    juego = {};
  }

  const preguntas = preguntasProp || juego?.preguntas || [];
  const indiceActual = indiceProp ?? juego?.indiceActual ?? -1;
  const started = startedProp ?? juego?.started ?? false;
  const total = preguntas.length;

  const size = 420;
  const center = size / 2;
  const radius = 180;
  const circleR = 20;

  return (
    <div className="mx-auto w-full max-w-[90vw] sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <defs>
          <radialGradient id="roscoGradientLightBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#89A2F7" />
            <stop offset="100%" stopColor="#879EF3" />
          </radialGradient>

          <linearGradient id="roscoGradientBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67A6F5" />
            <stop offset="100%" stopColor="#5e60efff" />
          </linearGradient>

          <linearGradient id="roscoGradientYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D5C94E" />
            <stop offset="100%" stopColor="#D59B1F" />
          </linearGradient>

          <linearGradient id="roscoGradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3EDB98" />
            <stop offset="100%" stopColor="#37C450" />
          </linearGradient>

          <linearGradient id="roscoGradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DA0924" />
            <stop offset="100%" stopColor="#B30011" />
          </linearGradient>

          <linearGradient id="roscoGradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#7b54d6ff" />
          </linearGradient>
        </defs>

        {preguntas.map((p, i) => {
          const angleDeg = (360 / total) * i - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = center + radius * Math.cos(angleRad);
          const y = center + radius * Math.sin(angleRad);

          let fill = 'url(#roscoGradientBlue)';
          if (started) {
            if (p.estado === 'pasado') fill = 'url(#roscoGradientYellow)';
            else if (p.estado === 'correcto') fill = 'url(#roscoGradientGreen)';
            else if (p.estado === 'incorrecto') fill = 'url(#roscoGradientRed)';
            else if (i === indiceActual) fill = 'url(#roscoGradientLightBlue)';
          }

          const anim = started && i === indiceActual && p.estado === 'pendiente' ? 'animate-pulse' : '';

          return (
            <g key={p.letra} className={anim}>
              <circle cx={x} cy={y} r={circleR} fill={fill} stroke="#686674B0" strokeWidth={1.5} />
              <text
                x={x}
                y={y + circleR / 3}
                textAnchor="middle"
                fontFamily="'Ubuntu', sans-serif"
                fontSize="16"
                fontWeight="bold"
                fill="#fff"
              >
                {p.letra}
              </text>
            </g>
          );
        })}

        <circle cx={center} cy={center} r={24} stroke="#686674B0" strokeWidth={2} fill="url(#roscoGradientPurple)" />
        <text x={center} y={center + 6} textAnchor="middle" fontSize="22"></text>
      </svg>
    </div>
  );
};

export default Rosco;