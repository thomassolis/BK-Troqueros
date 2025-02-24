import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { SaveFile } from '../../fileManager/saveFile.js';

//Inserta un chasis
export const InsertChassis = async (chassis, PATH, file) => {
    try {
        // Iniciar transacción
        const transaction = new sql.Transaction(pool);
        // Comienza la transacción
        await transaction.begin();

        const result = await transaction.request()
                                .input("Placa", sql.VarChar, chassis.placa)
                                .input("NumPoliza", sql.VarChar, chassis.numPoliza)
                                .input("FechaExpedicion", sql.Date, chassis.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, chassis.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, chassis.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, chassis.fechaUltRevisado)
                                .query(`DECLARE @NuevoID CHAR(7);
                                        EXEC Prc_GenerarIDChasis @NuevoID OUTPUT
                                        
                                        INSERT INTO [Troqueros].[dbo].[Chasis] (id_chasis, placa, numero_poliza, 
                                        fecha_expedicion_poliza, fecha_caducidad_poliza, fecha_renovacion_revisado,
                                        fecha_ultimo_revisado, foto_poliza)
                                        OUTPUT INSERTED.id_chasis
                                        VALUES (@NuevoID, @Placa, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
                                        @FechaRenovacion, @FechaUltRevisado, CONCAT('${PATH}', '\\', CAST(@NuevoID AS VARCHAR), '\\', '${file.name}'))`);

        //Obtenemos el id del chasis insertado
        const idChasis = result.recordset[0].id_chasis;

        //validamos que el idChasis exista
        if (!idChasis) {
            return false;
        }

        //guardamos el archivo
        const fileSaved = SaveFile(PATH, idChasis, file);

        //validamos que el archivo se haya guardado
        if (!fileSaved) {
            // Si el archivo no se guardó correctamente, revertimos la transacción
            await transaction.rollback();
            return false;
        }

        // Si todo está bien, se realiza un commit y se hace el insert
        await transaction.commit();
        
        return true;
    } catch (error) {
        let MyThrow =  new Error(`No se pudo insertar el chasis, ${error.message}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.msg = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            }

            MyThrow.msg = 'La placa ya existe.';
        }

        HandleError(v1(), error.message, 'querys/Chassis/insertChassis/InsertChassis', error, 'user');
        throw MyThrow;
    }
}