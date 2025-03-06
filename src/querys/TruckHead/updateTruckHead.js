import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';

//Actualiza el cabezal con los datos de la request
export const UpdateTruckHead = async (truckHead, files) => {
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        // Comienza la transacción
        await transaction.begin();

        //construimos la ruta de las carpetas
        const rutaPoliza = `cabezal/${truckHead.id_cabezal}/poliza`;
        const rutaRevisado = `cabezal/${truckHead.id_cabezal}/revisado`;

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
                            foto_poliza = '${rutaPoliza}',
                            foto_revisado = '${rutaRevisado}',
                            fecha_modificación = GETDATE()
                    WHERE id_cabezal = @IdTruckHead`);
        
        //valida la existencia de los archivos
        if (!files) {
            await UpdateFile(rutaPoliza, null);
            await UpdateFile(rutaRevisado, null);
        }
                
        //elimina los archivos el archivo
        const fileEliminated = files && files.foto_poliza ? await UpdateFile(rutaPoliza, files.foto_poliza) : {success:true, msg:''};
        const fileEliminated2 = files && files.foto_revisado ? await UpdateFile(rutaRevisado, files.foto_revisado) : {success:true, msg:''};

        //Valida que se haya guardado los archivos
        if (!fileEliminated.success || !fileEliminated2.success) {
            await transaction.rollback();
            throw new Error('Error al eliminar los archivos. Se revirtió la transacción.');
        }

        // Si todo está bien, se realiza un commit y se hace el update
        await transaction.commit();
        
        return true;
    } catch (error) {
        //revierte la actualización del chasis
        await transaction.rollback();

        HandleError(v1(), error.message, 'querys/TruckHead/updateTruckHead/UpdateTruckHead');
        throw new Error(`${error.msg}`);
    }
}