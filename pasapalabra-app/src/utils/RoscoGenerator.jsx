// src/utils/RoscoGenerator.jsx
import diccionario from '../data/diccionario.json';

/**
 * Genera una pregunta por cada letra en el JSON,
 * escogiendo una entrada aleatoria de cada array.
 * Devuelve un array: [{ letra, pregunta, respuesta, estado }, …]
 */
export function generarRoscoDesdeJSON() {
  // Obtenemos cada par [letra, entradas]
  return Object.entries(diccionario).map(([letra, entradas]) => {
    // Escogemos índice aleatorio
    const idx = Math.floor(Math.random() * entradas.length);
    const { palabra, definicion } = entradas[idx];
    return {
      letra,
      pregunta: definicion,
      respuesta: palabra,
      estado: 'pendiente'
    };
  });
}
