// src/services/__tests__/firebaseGameRTDB.test.js
import { 
  crearSala,
  obtenerSala,
  setPresencia,
  marcarListo,
  confirmarTurno,
  pasarTurno,
  setTiempoInicial,
  responder
} from '../firebaseGameRTDB';
import * as dbModule from 'firebase/database';
import { dbRT } from '../../firebase/index';
import { generarRoscoDesdeJSON } from '../../utils/RoscoGenerator';

jest.mock('firebase/database');
jest.mock('../../utils/RoscoGenerator', () => ({
  generarRoscoDesdeJSON: jest.fn(() => [{ letra: 'A', estado: 'pendiente'}])
}));

describe('firebaseGameRTDB', () => {
  const roomId = 'room123';
  const jugador = 'p1';

  beforeEach(() => {
    jest.clearAllMocks();
    // ref(dbRT, `salas/${roomId}`) debe retornar un objeto de referencia:
    dbModule.ref.mockImplementation((db, path) => ({ path }));
  });

  test('crearSala: should call set() with correct initial data', async () => {
    await crearSala(roomId);
    expect(dbModule.set).toHaveBeenCalledTimes(1);
    const [refArg, data] = dbModule.set.mock.calls[0];
    expect(refArg).toEqual({ path: `salas/${roomId}` });
    // Chequear keys fundamentales
    expect(data.turno).toBe('p1');
    expect(data.jugadores).toEqual({ p1: false, p2: false });
    expect(data.preguntas_p1).toEqual([{ letra: 'A', estado: 'pendiente' }]);
  });

  test('obtenerSala: should return data when snapshot exists', async () => {
    // Simula snap.exists() y snap.val()
    const fakeSnap = { exists: () => true, val: () => ({ foo: 'bar' }) };
    dbModule.get.mockResolvedValueOnce(fakeSnap);

    const result = await obtenerSala(roomId);
    expect(dbModule.get).toHaveBeenCalledWith({ path: `salas/${roomId}` });
    expect(result).toEqual({ foo: 'bar' });
  });

  test('obtenerSala: should return null if no data', async () => {
    const fakeSnap = { exists: () => false };
    dbModule.get.mockResolvedValueOnce(fakeSnap);

    const result = await obtenerSala(roomId);
    expect(result).toBeNull();
  });

  test('setPresencia: updates only the jugador field', async () => {
    await setPresencia(roomId, jugador);
    expect(dbModule.update).toHaveBeenCalledWith(
      { path: `salas/${roomId}/jugadores` },
      { [jugador]: true }
    );
  });

  test('marcarListo: updates only the listo field', async () => {
    await marcarListo(roomId, jugador);
    expect(dbModule.update).toHaveBeenCalledWith(
      { path: `salas/${roomId}/listo` },
      { [jugador]: true }
    );
  });

  test('confirmarTurno: sets turnConfirmed and turnEndAt', async () => {
    const durMs = 150000;
    const before = Date.now();
    await confirmarTurno(roomId, durMs);
    expect(dbModule.update).toHaveBeenCalledWith(
      { path: `salas/${roomId}` },
      expect.objectContaining({
        turnConfirmed: true,
        turnEndAt: expect.any(Number)
      })
    );
    const calledEndAt = dbModule.update.mock.calls[0][1].turnEndAt;
    expect(calledEndAt).toBeGreaterThanOrEqual(before + durMs);
  });

  test('pasarTurno: switches turno and resets flags', async () => {
    const remaining = 42;
    // Suponemos currentPlayer = 'p1'
    await pasarTurno(roomId, 'p1', remaining);
    expect(dbModule.update).toHaveBeenCalledWith(
      { path: `salas/${roomId}` },
      expect.objectContaining({
        turno: 'p2',
        turnConfirmed: false,
        turnEndAt: null,
        'tiemposRestantes/p1': remaining
      })
    );
  });

  test('setTiempoInicial: updates tiempos and tiemposRestantes', async () => {
    await setTiempoInicial(roomId, jugador, 99);
    expect(dbModule.update).toHaveBeenCalledWith(
      { path: `salas/${roomId}` },
      {
        'tiempos/p1': 99,
        'tiemposRestantes/p1': 99
      }
    );
  });

  test('responder: updates preguntas array and puntajes', async () => {
    // Simula obtenerSala con una pregunta pendiente y puntaje inicial
    const salaData = {
      preguntas_p1: [{ estado: 'pendiente' }],
      puntajes: { p1: 0 }
    };
    jest.spyOn(dbModule, 'get').mockResolvedValueOnce({
      exists: () => true,
      val: () => salaData
    });

    await responder(roomId, 'p1', 'correcto');
    // Debe actualizar preguntas_p1 y puntajes.p1 = 1
    const [refArg, data] = dbModule.update.mock.calls.find(
      ([ref]) => ref.path === `salas/${roomId}`
    );
    expect(data.preguntas_p1[0].estado).toBe('correcto');
    expect(data.puntajes.p1).toBe(1);
  });
});
