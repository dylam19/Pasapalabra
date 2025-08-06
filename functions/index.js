// functions/index.js
const { onValueWritten } = require('firebase-functions/v2/database');
const admin              = require('firebase-admin');

admin.initializeApp();
const db = admin.database();

exports.cleanupEmptyRooms = onValueWritten(
  { ref: '/salas/{roomId}/jugadores' },
  async (event) => {
    const before = event.data.before.val() || {};
    const after  = event.data.after.val()  || {};
    const wasNonEmpty = before.p1 || before.p2;
    const isEmpty     = !after.p1 && !after.p2;

    if (wasNonEmpty && isEmpty) {
      console.log(`🔨 Borrando sala ${event.params.roomId} porque quedó vacía`);
      await db.ref(`/salas/${event.params.roomId}`).remove();
    }
    return null;
  }
);
