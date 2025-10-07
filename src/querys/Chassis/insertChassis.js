import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { SaveFile } from '../../fileManager/saveFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Inserta un chasis
export const InsertChassis = async (chassis, file) => {
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
                    EXEC Prc_GenerarIDChasis @NuevoID OUTPUT;
                    SELECT @NuevoID AS id_chasis;`);
        
        //obtenemos el id del chasis
        const idChasis = idResult.recordset[0].id_chasis;

        //validamos que id del chasis exista
        if (!idChasis) {
            throw new Error('No se pudo generar el ID del chasis.');
        }

        //construimos la ruta de las carpetas
        const rutaPoliza = `chassis/${idChasis}/poliza`;
        const rutaRevisado = `chassis/${idChasis}/revisado`;

        //Hacemos el INSERT con las rutas generadas
        const result = await transaction.request()
            .input("Placa", sql.VarChar, chassis.placa)
            .input("Status", sql.VarChar, chassis.status)
            .input("NumPoliza", sql.VarChar, chassis.numPoliza)
            .input("FechaExpedicion", sql.Date, chassis.fechaExpedicion)
            .input("FechaCaducidad", sql.Date, chassis.fechaCaducidad)
            .input("FechaRenovacion", sql.Date, chassis.fechaRenovacion)
            .input("FechaUltRevisado", sql.Date, chassis.fechaUltRevisado)
            .query(`
                INSERT INTO [Chasis] 
                (id_chasis, placa, status, numero_poliza, fecha_expedicion_poliza, fecha_caducidad_poliza, 
                fecha_renovacion_revisado, fecha_ultimo_revisado, foto_poliza, foto_revisado)
                VALUES ('${idChasis}', @Placa, @Status, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
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

        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.POST);

        // Valida si el error ha sido por primary key o unique key
        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo insertar el chasis, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.message = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            } else {
                MyThrow.message = 'La placa ya existe.';
            }

            HandleError(code, error.message, 'querys/Chassis/insertChassis/InsertChassis', error);
            throw MyThrow
        }

        
        HandleError(code, error.message, 'querys/Chassis/insertChassis/InsertChassis', error);
        throw new Error('Ha ocurrido un error al crear el chasis');
    }
}