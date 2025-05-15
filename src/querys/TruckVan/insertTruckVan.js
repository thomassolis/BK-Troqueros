import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { SaveFile } from '../../fileManager/saveFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Inserta un furgon
export const InsertTruckVan = async (truckVan, file) => {
    let transaction = null;

    try {
        //validamos si file tiene datos
        if (file) {
            file = Object.assign({}, file);
        }

        transaction = new sql.Transaction(pool); // Instanciamos un objecto Transaction
        await transaction.begin(); // Comienza la transacción

        //Generamos el ID del furgon antes del INSERT
        const idResult = await transaction.request()
            .query(`DECLARE @NuevoID CHAR(7);
                    EXEC Prc_GenerarIDFurgon @NuevoID OUTPUT;
                    SELECT @NuevoID AS id_furgon;`);
        
        //obtenemos el id del furgon
        const idFurgon = idResult.recordset[0].id_furgon;

        //validamos que id del furgon exista
        if (!idFurgon) {
            throw new Error('No se pudo generar el ID del Furgon.');
        }

        //construimos la ruta de las carpetas
        const rutaPoliza = `furgon/${idFurgon}/poliza`;
        const rutaRevisado = `furgon/${idFurgon}/revisado`;

        //Hacemos el INSERT con las rutas generadas
        const result = await transaction.request()
            .input("Placa", sql.VarChar, truckVan.placa)
            .input("Status", sql.VarChar, truckVan.status)
            .input("NumPoliza", sql.VarChar, truckVan.numPoliza)
            .input("FechaExpedicion", sql.Date, truckVan.fechaExpedicion)
            .input("FechaCaducidad", sql.Date, truckVan.fechaCaducidad)
            .input("FechaRenovacion", sql.Date, truckVan.fechaRenovacion)
            .input("FechaUltRevisado", sql.Date, truckVan.fechaUltRevisado)
            .query(`
                INSERT INTO [Troqueros].[dbo].[Furgon] 
                (id_furgon, placa, status, numero_poliza, fecha_expedicion_poliza, fecha_caducidad_poliza, 
                fecha_renovacion_revisado, fecha_ultimo_revisado, foto_poliza, foto_revisado)
                VALUES ('${idFurgon}', @Placa, @Status, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
                        @FechaRenovacion, @FechaUltRevisado, '${rutaPoliza}', '${rutaRevisado}')
            `);
        
        //guardamos el archivo
        const fileSaved = file && file.foto_poliza ? await SaveFile(rutaPoliza, file.foto_poliza) : true;
        const fileSaved2 = file && file.foto_revisado ? await SaveFile(rutaRevisado, file.foto_revisado) : true;

        //Valida que se haya guardado los archivos
        if (!fileSaved || !fileSaved2) {
            await transaction.rollback();
            throw new Error('Error al guardar los archivos. Se revirtió la transacción.');
        }

        // Valida que se haya hecho el insert
        if (result.rowsAffected > 0) {
            await transaction.commit();        
            return true;
        }

        await transaction.rollback();        
        return false;  
    } catch (error) {
        // En caso de error revertimos la transaction
        if (transaction) {
            await transaction.rollback();
        }

        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.POST);

        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo insertar el furgon, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.message = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            } else {
                MyThrow.message = 'La placa ya existe.';
            }

            HandleError(code, error.message, 'querys/TruckVan/insertTruckVan/InsertTruckVan', error);  
            throw MyThrow;
        }        
        
        HandleError(code, error.message, 'querys/TruckVan/insertTruckVan/InsertTruckVan', error);  
        throw new Error('Ha ocurrido un error al crear el furgon');
    }
}