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
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        //validamos si file tiene datos
        if (file) {
            file = Object.assign({}, file);
        }

        // Comienza la transacción
        await transaction.begin();

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
            .input("Status", sql.VarChar, chassis.status)
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

        // Si todo está bien, se realiza un commit y se hace el insert
        await transaction.commit();
        
        return true;  
    } catch (error) {
        await transaction.rollback();
        
        let MyThrow =  new Error(`No se pudo insertar el furgon, ${error.message}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.msg = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            }

            MyThrow.msg = 'La placa ya existe.';
        }
        
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.POST);
        HandleError(code, error.message, 'querys/TruckVan/insertTruckVan/InsertTruckVan', error);  
        throw MyThrow;
    }
}