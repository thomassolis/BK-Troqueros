import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Actualiza el chasis con los datos de la request
export const UpdateChassis = async (chassis) => {
    try {
        console.log(chassis);
        const result = await pool.request()
                                .input("IdUser", sql.VarChar, chassis.id_chasis)
                                .input("Status", sql.VarChar, chassis.status)
                                .input("FechaExpedicion", sql.Date, chassis.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, chassis.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, chassis.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, chassis.fechaUltRevisado)
                                .input("Foto", sql.VarChar, chassis.foto)
                                .query(`UPDATE [Troqueros].[dbo].[Chasis]
                                            SET status = @Status,
                                                fecha_expedicion_poliza = @FechaExpedicion,
                                                fecha_caducidad_poliza = @FechaCaducidad,
                                                fecha_renovacion_revisado = @FechaRenovacion,
                                                fecha_ultimo_revisado = @FechaUltRevisado,
                                                foto_poliza = @Foto,
                                                fecha_modificación = GETDATE()
                                        WHERE id_chasis = @IdUser`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/Chassis/updateChassis/UpdateChassis');
        throw new Error('No se pudo actualizar el chasis');
    }
}