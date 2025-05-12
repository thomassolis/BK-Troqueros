import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Actualiza el cabezal con los datos de la request
export const UpdateTruckHead = async (truckHead, files) => {
    let transaction = null;

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
        const rutaPoliza = `cabezal/${truckHead.id}/poliza`;
        const rutaRevisado = `cabezal/${truckHead.id}/revisado`;

        const result = await transaction.request()
            .input("IdTruckHead", sql.VarChar, truckHead.id)
            .input("Placa", sql.VarChar, truckHead.placa)
            .input("Status", sql.VarChar, truckHead.status)
            .input("NumPoliza", sql.VarChar, truckHead.numPoliza)
            .input("FechaExpedicion", sql.Date, truckHead.fechaExpedicion)
            .input("FechaCaducidad", sql.Date, truckHead.fechaCaducidad)
            .input("FechaRenovacion", sql.Date, truckHead.fechaRenovacion)
            .input("FechaUltRevisado", sql.Date, truckHead.fechaUltRevisado)
            .query(`UPDATE [Troqueros].[dbo].[Cabezal]
                        SET placa = @Placa,
                            status = @Status,
                            numero_poliza = @NumPoliza,
                            fecha_expedicion_poliza = @FechaExpedicion,
                            fecha_caducidad_poliza = @FechaCaducidad,
                            fecha_renovacion_revisado = @FechaRenovacion,
                            fecha_ultimo_revisado = @FechaUltRevisado,
                            fecha_modificación = GETDATE()
                    WHERE id_cabezal = @IdTruckHead`);
                
        //valida que los archivos exista
        //actualiza los archivos del cabezal
        const fileEliminated = cleanFiles && cleanFiles.foto_poliza ? await UpdateFile(rutaPoliza, cleanFiles.foto_poliza) : await UpdateFile(rutaPoliza, null);
        const fileEliminated2 = cleanFiles && cleanFiles.foto_revisado ? await UpdateFile(rutaRevisado, cleanFiles.foto_revisado) : await UpdateFile(rutaRevisado, null);

        //Valida que se haya guardado los archivos
        if (!fileEliminated.success || !fileEliminated2.success) {
            await transaction.rollback();
            throw new Error('Error al eliminar los archivos. Se revirtió la transacción.');
        }

        // Valida que se haya hecho la actualización
        if (result.rowsAffected > 0) {
            await transaction.commit();            
            return true;
        }
        
        // Revierte la transaction
        await transaction.rollback();        
        return false;
    } catch (error) {
        //revierte la actualización del cabezal
        if (transaction) {
            await transaction.rollback();
        }

        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo actualizar el furgon, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.message = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            } else {
                MyThrow.message = 'La placa ya existe.';
            }

            throw MyThrow;
        }

        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PUT);
        HandleError(code, error.message, 'querys/TruckHead/updateTruckHead/UpdateTruckHead', error);
        throw new Error('Ha ocurrido un error al actualizar la información del cabezal');
    }
}