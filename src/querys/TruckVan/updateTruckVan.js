import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';

//Actualiza el furgon con los datos de la request
export const UpdateTruckVan = async (truckVan, files) => {
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        // Comienza la transacción
        await transaction.begin();

        //construimos la ruta de las carpetas
        const rutaPoliza = `furgon/${truckVan.id_furgon}/poliza`;
        const rutaRevisado = `furgon/${truckVan.id_furgon}/revisado`;

        const result = await pool.request()
                                .input("IdTruckVan", sql.Char(7), truckVan.id_furgon)
                                .input("Status", sql.VarChar, truckVan.status)
                                .input("FechaExpedicion", sql.Date, truckVan.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, truckVan.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, truckVan.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, truckVan.fechaUltRevisado)
                                .query(`UPDATE [Troqueros].[dbo].[Furgon]
                                            SET status = @Status,
                                                fecha_expedicion_poliza = @FechaExpedicion,
                                                fecha_caducidad_poliza = @FechaCaducidad,
                                                fecha_renovacion_revisado = @FechaRenovacion,
                                                fecha_ultimo_revisado = @FechaUltRevisado,
                                                foto_poliza = '${rutaPoliza}',
                                                foto_revisado = '${rutaRevisado}',
                                                fecha_modificación = GETDATE()
                                        WHERE id_furgon = @IdTruckVan`);
        
        //valida que los archivos exista
        //actualiza los archivos del furgon
        const fileEliminated = files && files.foto_poliza ? await UpdateFile(rutaPoliza, files.foto_poliza) : await UpdateFile(rutaPoliza, null);
        const fileEliminated2 = files && files.foto_revisado ? await UpdateFile(rutaRevisado, files.foto_revisado) : await UpdateFile(rutaRevisado, null);

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

        HandleError(v1(), error.message, 'querys/TruckVan/updateTruckVan/UpdateTruckVan');
        throw new Error(`${error.msg}`);
    }
}