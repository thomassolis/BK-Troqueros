import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Actualiza el cabezal con los datos de la request
export const UpdateTruckHead = async (truckHead, files) => {
    // Iniciar transacción
    let transaction = new sql.Transaction(pool);

    try {
        const cleanFiles = {}; // Instanciamos un nuevo objeto

        // Obtenemos los archivos
        // Guardamos lor archivos en el objeto creado
        Object.keys(files).forEach(key => {
            const value = files[key]; // Obtenemos la llave del objeto

            // Valida si el objeto es un array
            // De lo contrario lo convierte a un array
            cleanFiles[key] = Array.isArray(value) ? value : [value];
        });

        transaction = new sql.Transaction(pool); // Creamos la transaction

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
        //revierte la actualización del cabezal
        if (transaction) {
            await transaction.rollback();
        } 

        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PUT);
        HandleError(code, error.message, 'querys/TruckHead/updateTruckHead/UpdateTruckHead');
        throw new Error(`${error.msg}`);
    }
}