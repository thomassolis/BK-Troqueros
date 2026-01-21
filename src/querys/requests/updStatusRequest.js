import { pool } from '../../db/db.js';
import sql from 'mssql';
import crypto from 'crypto';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

export const UpdateStatusRequest = async (request, userData) => {
  let transaction = null;

  try {
    let query = `
      UPDATE [Peticiones]
      SET [status] = @Status,
          [fecha_modificación] = GETDATE()
    `;

    if (request.status === 'Completado') {
      query += `, [fecha_finalizacion] = GETDATE()\n`;
    }

    query += ` WHERE [id_peticion] = @ID;`;

    // 1) Crear y comenzar transacción
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // 2) Setear contexto EN LA MISMA SESION de la transacción
    const batchId = crypto.randomUUID();
    await transaction.request()
      .input("UserId", sql.Int, userData.id_usuario)
      .input("BatchId", sql.UniqueIdentifier, batchId)
      .query(`
        EXEC sys.sp_set_session_context @key=N'UserId',  @value=@UserId;
        EXEC sys.sp_set_session_context @key=N'BatchId', @value=@BatchId;
      `);

    // 3) Ejecutar el UPDATE usando transaction.request (NO pool.request)
    const result = await transaction.request()
      .input("ID", sql.VarChar, request.id_peticion)
      .input("Status", sql.VarChar, request.status)
      .query(query);

    if (result.rowsAffected?.[0] > 0) {
      await transaction.commit();
      return true;
    }

    await transaction.rollback();
    return false;

  } catch (error) {
    if (transaction) {
      try { await transaction.rollback(); } catch {}
    }
    const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PATCH);
    HandleError(code, error.message, 'querys/requests/UpdateStatusRequest', error);
    throw new Error('Ha ocurrido un error al actualizar el estado de la petición');
  }
};
