import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { SaveFile } from '../../fileManager/saveFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//inserta un cabezal
export const InsertTruckHead = async (truckHead, file) => {
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        //validamos si file tiene datos
        if (file) {
            file = Object.assign({}, file);
        }

        // Comienza la transacción
        await transaction.begin();

        //Generamos el ID del chasis antes del INSERT
        const idResult = await transaction.request()
            .query(`DECLARE @NuevoID CHAR(7);
                    EXEC Prc_GenerarIDCabezal @NuevoID OUTPUT;
                    SELECT @NuevoID AS id_cabezal;`);
        
        //obtenemos el id del cabezal
        const idCabezal = idResult.recordset[0].id_cabezal;

        //validamos que id del cabezal exista
        if (!idCabezal) {
            throw new Error('No se pudo generar el ID del cabezal.');
        }

        //construimos la ruta de las carpetas
        const rutaPoliza = `cabezal/${idCabezal}/poliza`;
        const rutaRevisado = `cabezal/${idCabezal}/revisado`;

        //Hacemos el INSERT con las rutas generadas
        const result = await transaction.request()
            .input("Placa", sql.VarChar, truckHead.placa)
            .input("Status", sql.VarChar, chassis.status)
            .input("NumPoliza", sql.VarChar, truckHead.numPoliza)
            .input("FechaExpedicion", sql.Date, truckHead.fechaExpedicion)
            .input("FechaCaducidad", sql.Date, truckHead.fechaCaducidad)
            .input("FechaRenovacion", sql.Date, truckHead.fechaRenovacion)
            .input("FechaUltRevisado", sql.Date, truckHead.fechaUltRevisado)
            .query(`
                INSERT INTO [Troqueros].[dbo].[Cabezal] 
                (id_cabezal, placa, status, numero_poliza, fecha_expedicion_poliza, fecha_caducidad_poliza, 
                fecha_renovacion_revisado, fecha_ultimo_revisado, foto_poliza, foto_revisado)
                VALUES ('${idCabezal}', @Placa, @Status, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
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
        await transaction.rollback();

        let MyThrow =  new Error(`No se pudo insertar el cabezal, ${error.message}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.msg = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            }

            MyThrow.msg = 'La placa ya existe.';
        }

        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.POST);
        HandleError(code, error.message, 'querys/TruckHead/insertTruckHead/InsertTruckHead', error);
        throw MyThrow;
    }
}