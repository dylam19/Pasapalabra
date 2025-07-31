// src/utils/RoscoGenerator.jsx
import diccionario from '../data/diccionario_final_completo.json';

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

    // Detectamos si empieza o solo contiene
    const lowerPal = palabra.toLowerCase();
    const lowerLet = letra.toLowerCase();
    const modo = lowerPal.startsWith(lowerLet) ? 'inicia' : 'contiene';

    return {
      letra,
      palabra,
      definicion,
      modo,           // <-- nuevo campo
      estado: 'pendiente'
    };
  });
}