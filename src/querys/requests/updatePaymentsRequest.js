// querys/requests/updateRequest/refreshPayments.js
import sql from '../../db/db.js';

/**
 * Refresca (DELETE + INSERT) los pagos de una petición.
 * - Borra todos los pagos existentes de la petición
 * - Inserta todos los pagos recibidos en 'paymentData'
 *
 * @param {sql.Transaction} transaction
 * @param {string} idPeticion
 * @param {Array<{descripcionDePago?: string, montoPagado?: number, referenciaBancaria?: string}>} paymentData
 * @returns {Promise<boolean>}
 */
export const RefreshPaymentsRequest = async (transaction, idPeticion, paymentData = []) => {
  // 1) Borrar los pagos actuales
  await transaction
    .request()
    .input("ID", sql.VarChar, idPeticion)
    .query(`
      DELETE FROM PagosPorPeticion
      WHERE id_peticion = @ID;
    `);

  // 2) Si no hay nada que insertar, termina
  if (!Array.isArray(paymentData) || paymentData.length === 0) return true;

  // 3) Insertar todo lo nuevo (multi-values parametrizado)
  const req = transaction.request();

  // Param raíz (id_peticion)
  req.input("ID", sql.VarChar, idPeticion);

  const values = [];
  paymentData.forEach((p, i) => {
    req.input(`desc${i}`, sql.VarChar, p?.descripcionDePago ?? null);
    req.input(`monto${i}`, sql.Float, p?.montoPagado ?? null);
    req.input(`ref${i}`, sql.VarChar, p?.referenciaBancaria ?? null);

    // OJO: usa los nombres de columnas reales de tu tabla.
    // Si tu tabla tiene 'descripcionDePago', usa ese nombre (como en tu SELECT).
    // Si se llama 'descripcion', cambia aquí también.
    values.push(`(@ID, @desc${i}, @monto${i}, @ref${i})`);
  });

  await req.query(`
    INSERT INTO PagosPorPeticion (id_peticion, descripcionDePago, montoPagado, referenciaBancaria)
    VALUES ${values.join(", ")}
  `);

  return true;
};
