import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Actualiza el chasis con los datos de la request
export const UpdateChassis = async (chassis, files) => {
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        // Comienza la transacción
        await transaction.begin();

        //construimos la ruta de las carpetas
        const rutaPoliza = `chassis/${chassis.id_chasis}/poliza`;
        const rutaRevisado = `chassis/${chassis.id_chasis}/revisado`;

        const result = await transaction.request()
            .input("IdChasis", sql.VarChar, chassis.id_chasis)
            .input("Status", sql.VarChar, chassis.status)
            .input("FechaExpedicion", sql.Date, chassis.fechaExpedicion)
            .input("FechaCaducidad", sql.Date, chassis.fechaCaducidad)
            .input("FechaRenovacion", sql.Date, chassis.fechaRenovacion)
            .input("FechaUltRevisado", sql.Date, chassis.fechaUltRevisado)
            .query(`UPDATE [Troqueros].[dbo].[Chasis]
                        SET status = @Status,
                            fecha_expedicion_poliza = @FechaExpedicion,
                            fecha_caducidad_poliza = @FechaCaducidad,
                            fecha_renovacion_revisado = @FechaRenovacion,
                            fecha_ultimo_revisado = @FechaUltRevisado,
                            foto_poliza = '${rutaPoliza}',
                            foto_revisado = '${rutaRevisado}',
                            fecha_modificación = GETDATE()
                    WHERE id_chasis = @IdChasis`);
        
        //valida que los archivos exista
        //actualiza los archivos del chasis
        const fileEliminated = files && files.foto_poliza ? await UpdateFile(rutaPoliza, files.foto_poliza) : await UpdateFile(rutaPoliza, null);
        const fileEliminated2 = files && files.foto_revisado ? await UpdateFile(rutaRevisado, files.foto_revisado) : await UpdateFile(rutaRevisado, null);

        //Valida que se haya guardado los archivos
        if (!fileEliminated.success || !fileEliminated2.success) {
            await transaction.rollback();
            throw new Error('Error al actualizar los archivos. Se revirtió la transacción.');
        }

        // Si todo está bien, se realiza un commit y se hace el update
        await transaction.commit();
        
        return true;
    } catch (error) {
        //revierte la actualización del chasis
        await transaction.rollback();

        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/Chassis/updateChassis/UpdateChassis', error);
        throw new Error(`${error.msg}`);
    }
}