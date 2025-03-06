import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';

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

        //valida la existencia de los archivos
        if (!files) {
            UpdateFile(rutaPoliza, null);
            UpdateFile(rutaRevisado, null);
        }
        
        //actualiza los archivos
        const fileEliminated = files && files.foto_poliza ? await UpdateFile(rutaPoliza, files.foto_poliza) : {success:true, msg:''};
        const fileEliminated2 = files && files.foto_revisado ? await UpdateFile(rutaRevisado, files.foto_revisado) : {success:true, msg:''};

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

        HandleError(v1(), error.message, 'querys/Chassis/updateChassis/UpdateChassis', error, 'user');
        throw new Error(`${error.msg}`);
    }
}