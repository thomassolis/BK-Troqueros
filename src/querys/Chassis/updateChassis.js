import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Actualiza el chasis con los datos de la request
export const UpdateChassis = async (chassis, files) => {
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
        const rutaPoliza = `chassis/${chassis.id}/poliza`;
        const rutaRevisado = `chassis/${chassis.id}/revisado`;

        const result = await transaction.request()
            .input("IdChasis", sql.VarChar, chassis.id)
            .input("Placa", sql.VarChar, chassis.placa)
            .input("Status", sql.VarChar, chassis.status)
            .input("NumPoliza", sql.VarChar, chassis.numPoliza)
            .input("FechaExpedicion", sql.Date, chassis.fechaExpedicion)
            .input("FechaCaducidad", sql.Date, chassis.fechaCaducidad)
            .input("FechaRenovacion", sql.Date, chassis.fechaRenovacion)
            .input("FechaUltRevisado", sql.Date, chassis.fechaUltRevisado)
            .query(`UPDATE [Chasis]
                        SET placa = @Placa,
                            status = @Status,
                            numero_poliza = @NumPoliza,
                            fecha_expedicion_poliza = @FechaExpedicion,
                            fecha_caducidad_poliza = @FechaCaducidad,
                            fecha_renovacion_revisado = @FechaRenovacion,
                            fecha_ultimo_revisado = @FechaUltRevisado,
                            fecha_modificacion = GETDATE()
                    WHERE id_chasis = @IdChasis`);

        //valida que los archivos exista
        //actualiza los archivos del chasis
        const fileupdated = cleanFiles && cleanFiles.foto_poliza ? await UpdateFile(rutaPoliza, cleanFiles.foto_poliza) : await UpdateFile(rutaPoliza, null);
        const fileupdated2 = cleanFiles && cleanFiles.foto_revisado ? await UpdateFile(rutaRevisado, cleanFiles.foto_revisado) : await UpdateFile(rutaRevisado, null);

        //Valida que se haya guardado los archivos
        if (!fileupdated.success || !fileupdated2.success) {
            await transaction.rollback();
            throw new Error('Error al actualizar los archivos. Se revirtió la transacción.');
        }

        // Valida que se haya hecho la actualización
        if (result.rowsAffected > 0) {
            // Si todo está bien, se realiza un commit y se hace el update
            await transaction.commit();
            return true;
        }

        // Revierte la transaction
        await transaction.rollback();
        return false;
    } catch (error) {
        console.error(error)
        //revierte la actualización del chasis
        if (transaction) {
            await transaction.rollback();
        }

        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.PUT);

        // Valida si el error ha sido por primary key o unique key
        if (error.number === 2627) {
            let MyThrow = new Error(`No se pudo actualizar el chasis, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('UQ_')) {
                MyThrow.message = 'La placa insertada ya existe, favor de verificar la información a actualizar';
            } else {
                MyThrow.message = 'Ha ocurrido un error al actualizar la información del chasis';
            }

            HandleError(code, error.message, 'querys/Chassis/updateChassis/UpdateChassis', error);
            throw MyThrow;
        }

        HandleError(code, error.message, 'querys/Chassis/updateChassis/UpdateChassis', error);
        throw new Error('Ha ocurrido un error al actualizar la información del chasis');
    }
}