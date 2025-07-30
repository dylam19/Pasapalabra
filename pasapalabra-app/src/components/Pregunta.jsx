import { useJuego } from '../context/JuegoContext';

const Pregunta = () => {
  const { preguntas, indiceActual } = useJuego();
  const preguntaActual = preguntas[indiceActual];

  return (
    <div className="text-center mt-6 p-4 bg-darkBlue py-2 rounded shadow">
      <h2 className="text-xl font-bold">Letra: {preguntaActual.letra}</h2>
      <h3 className="text-xl font-bold">Palabra: {preguntaActual.palabra}</h3>
      <p className="mt-2">{preguntaActual.definicion}</p>
    </div>
  );
};

export default Pregunta;
