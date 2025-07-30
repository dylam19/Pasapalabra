// src/components/Rosco.jsx
import React from 'react';
import { useJuego } from '../context/JuegoContext';

const Rosco = () => {
  const { preguntas, indiceActual, started } = useJuego();
  const total = preguntas.length;

  const size = 360;
  const center = size / 2;
  const radius = 150;
  const circleR = 16;

  return (
    <div className="mx-auto w-full max-w-[350px] aspect-square">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <defs>
          {/* Degradado lineal a 45 grados */}
          <radialGradient
            id="roscoGradientLightBlue"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#89A2F7"  />   {/* color claro */}
            <stop offset="100%" stopColor="#879EF3" /> {/* color oscuro */}
          </radialGradient>

          <linearGradient
            id="roscoGradientBlue"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#67A6F5" />   {/* color claro */}
            <stop offset="100%" stopColor="#5e60efff" /> {/* color oscuro */}
          </linearGradient>


          <linearGradient
            id="roscoGradientYellow"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#D5C94E" />   {/* color claro */}
            <stop offset="100%" stopColor="#D59B1F" /> {/* color oscuro */}
          </linearGradient>

          <linearGradient
            id="roscoGradientGreen"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3EDB98" />   {/* color claro */}
            <stop offset="100%" stopColor="#37C450" /> {/* color oscuro */}
          </linearGradient>

          <linearGradient
            id="roscoGradientRed"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#DA0924" />   {/* color claro */}
            <stop offset="100%" stopColor="#B30011" /> {/* color oscuro */}
          </linearGradient>
        </defs>

        {preguntas.map((p, i) => {
          const angleDeg = (360 / total) * i - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = center + radius * Math.cos(angleRad);
          const y = center + radius * Math.sin(angleRad);

          // Determinamos el fill
          let fill = 'url(#roscoGradientBlue)'; // pendiente = degradado
          if (started) {
            if (p.estado === 'pasado') fill = 'url(#roscoGradientYellow)';       // amarillo
            else if (p.estado === 'correcto') fill = 'url(#roscoGradientGreen)';// verde
            else if (p.estado === 'incorrecto') fill = 'url(#roscoGradientRed)';// rojo
            else if (i === indiceActual) {
              fill = 'url(#roscoGradientLightBlue)'; // activo = cele e sólido
            }
          }

          // Para la letra activa sin responder podemos hacer un pulso
          const anim =
            started &&
            i === indiceActual &&
            preguntas[i].estado === 'pendiente'
              ? 'animate-pulse'
              : '';

          return (
            <g key={p.letra} className={anim}>
              <circle cx={x} cy={y} r={circleR} fill={fill} stroke="#686674B0" strokeWidth={1.5}/>
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

        {/* Centro con target */}
        <circle cx={center} cy={center} r={26} fill="#8B5CF6" />
        <text
          x={center}
          y={center + 6}
          textAnchor="middle"
          fontSize="22"
        >
          🎯
        </text>
      </svg>
    </div>
  );
};

export default Rosco;
