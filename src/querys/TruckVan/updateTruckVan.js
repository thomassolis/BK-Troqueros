import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Actualiza el furgon con los datos de la request
export const UpdateTruckVan = async (truckVan, files) => {
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
        const rutaPoliza = `furgon/${truckVan.id_furgon}/poliza`;
        const rutaRevisado = `furgon/${truckVan.id_furgon}/revisado`;

        const result = await pool.request()
                                .input("IdTruckVan", sql.VarChar, truckVan.id)
                                .input("Placa", sql.VarChar, truckVan.placa)
                                .input("NumPoliza", sql.VarChar, truckVan.numPoliza)
                                .input("FechaExpedicion", sql.Date, truckVan.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, truckVan.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, truckVan.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, truckVan.fechaUltRevisado)
                                .query(`UPDATE [Troqueros].[dbo].[Furgon]
                                            SET placa = @Placa,
                                                numero_poliza = @NumPoliza,
                                                fecha_expedicion_poliza = @FechaExpedicion,
                                                fecha_caducidad_poliza = @FechaCaducidad,
                                                fecha_renovacion_revisado = @FechaRenovacion,
                                                fecha_ultimo_revisado = @FechaUltRevisado,
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
        console.log(truckVan)
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
        //revierte la actualización del furgon
        if (transaction) {
            await transaction.rollback();
        }

        let MyThrow =  new Error(`No se pudo actualizar el furgon, ${error.msg}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.msg = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            }

            MyThrow.msg = 'La placa ya existe.';
        }

        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.PUT);
        HandleError(code, error.message, 'querys/TruckVan/updateTruckVan/UpdateTruckVan', error);
        throw MyThrow;
    }
}