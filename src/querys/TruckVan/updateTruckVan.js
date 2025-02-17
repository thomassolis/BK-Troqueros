import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Actualiza el furgon con los datos de la request
export const UpdateTruckVan = async (truckVan) => {
    try {
        const result = await pool.request()
                                .input("IdTruckVan", sql.Char(7), truckVan.id_furgon)
                                .input("Status", sql.VarChar, truckVan.status)
                                .input("FechaExpedicion", sql.Date, truckVan.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, truckVan.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, truckVan.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, truckVan.fechaUltRevisado)
                                .input("Foto", sql.VarChar, truckVan.foto)
                                .query(`UPDATE [Troqueros].[dbo].[Furgon]
                                            SET status = @Status,
                                                fecha_expedicion_poliza = @FechaExpedicion,
                                                fecha_caducidad_poliza = @FechaCaducidad,
                                                fecha_renovacion_revisado = @FechaRenovacion,
                                                fecha_ultimo_revisado = @FechaUltRevisado,
                                                foto_poliza = @Foto,
                                                fecha_modificación = GETDATE()
                                        WHERE id_furgon = @IdTruckVan`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckVan/updateTruckVan/UpdateTruckVan');
        throw new Error('No se pudo actualizar el furgon');
    }
}