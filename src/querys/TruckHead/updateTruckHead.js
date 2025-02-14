import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Actualiza el cabezal con los datos de la request
export const UpdateTruckHead = async (truckHead) => {
    try {
        const result = await pool.request()
                                .input("IdTruckHead", sql.VarChar, truckHead.id_cabezal)
                                .input("Status", sql.VarChar, truckHead.status)
                                .input("FechaExpedicion", sql.Date, truckHead.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, truckHead.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, truckHead.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, truckHead.fechaUltRevisado)
                                .input("Foto", sql.VarChar, truckHead.foto)
                                .query(`UPDATE [Troqueros].[dbo].[Cabezal]
                                            SET status = @Status,
                                                fecha_expedicion_poliza = @FechaExpedicion,
                                                fecha_caducidad_poliza = @FechaCaducidad,
                                                fecha_renovacion_revisado = @FechaRenovacion,
                                                fecha_ultimo_revisado = @FechaUltRevisado,
                                                foto_poliza = @Foto,
                                                fecha_modificación = GETDATE()
                                        WHERE id_cabezal = @IdTruckHead`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckHead/updateTruckHead/UpdateTruckHead');
        throw new Error('No se pudo actualizar el cabezal');
    }
}