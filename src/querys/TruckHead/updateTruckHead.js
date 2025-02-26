import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';

//Actualiza el cabezal con los datos de la request
export const UpdateTruckHead = async (truckHead, folders, files) => {
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        // Comienza la transacción
        await transaction.begin();

        // Verifica si existen los archivos antes de definir la ruta en la base de datos.
        // Si el archivo "foto_poliza" está presente, se genera su ruta con el ID del chasis.
        // Si no existe, se asigna NULL en la base de datos para evitar errores.
        // Lo mismo aplica para "foto_revisado".
        const rutaPoliza = files && files.foto_poliza ? `'${folders[0]}/${truckHead.id_cabezal}/${folders[1]}'` : 'NULL';
        const rutaRevisado = files && files.foto_revisado ? `'${folders[0]}/${truckHead.id_cabezal}/${folders[2]}'` : 'NULL';

        const result = await transaction.request()
                                .input("IdTruckHead", sql.VarChar, truckHead.id_cabezal)
                                .input("Status", sql.VarChar, truckHead.status)
                                .input("FechaExpedicion", sql.Date, truckHead.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, truckHead.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, truckHead.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, truckHead.fechaUltRevisado)
                                .query(`UPDATE [Troqueros].[dbo].[Cabezal]
                                            SET status = @Status,
                                                fecha_expedicion_poliza = @FechaExpedicion,
                                                fecha_caducidad_poliza = @FechaCaducidad,
                                                fecha_renovacion_revisado = @FechaRenovacion,
                                                fecha_ultimo_revisado = @FechaUltRevisado,
                                                foto_poliza = ${rutaPoliza},
                                                foto_revisado = ${rutaRevisado},
                                                fecha_modificación = GETDATE()
                                        WHERE id_cabezal = @IdTruckHead`);

        if (!files) {
            await DeleteFile(folders[0], truckHead.id_cabezal, folders[1], null);
            await DeleteFile(folders[0], truckHead.id_cabezal, folders[2], null);
        }
                
        //elimina los archivos el archivo
        const fileEliminated = files && files.foto_poliza ? await DeleteFile(folders[0], truckHead.id_cabezal, folders[1], files.foto_poliza) : true;
        const fileEliminated2 = files && files.foto_revisado ? await SaveFile(folders[0], truckHead.id_cabezal, folders[2], files.foto_revisado) : true;

        //Valida que se haya guardado los archivos
        if (!fileEliminated || !fileEliminated2) {
            await transaction.rollback();
            throw new Error('Error al eliminar los archivos. Se revirtió la transacción.');
        }

        // Si todo está bien, se realiza un commit y se hace el update
        await transaction.commit();
        
        return true;
    } catch (error) {
        await transaction.rollback();

        HandleError(v1(), error.message, 'querys/TruckHead/updateTruckHead/UpdateTruckHead');
        throw new Error('No se pudo actualizar el cabezal');
    }
}