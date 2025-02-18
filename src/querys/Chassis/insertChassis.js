import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

export const InsertChassis = async (chassis) => {
    try {
        const result = await pool.request()
                                .input("Placa", sql.VarChar, chassis.placa)
                                .input("NumPoliza", sql.VarChar, chassis.numPoliza)
                                .input("FechaExpedicion", sql.Date, chassis.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, chassis.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, chassis.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, chassis.fechaUltRevisado)
                                .input("Foto", sql.VarChar, chassis.foto)
                                .query(`DECLARE @NuevoID CHAR(7);
                                        EXEC GenerarIDChasis @NuevoID OUTPUT
                                        
                                        INSERT INTO [Troqueros].[dbo].[Chasis] (id_chasis, placa, numero_poliza, 
                                        fecha_expedicion_poliza, fecha_caducidad_poliza, fecha_renovacion_revisado,
                                        fecha_ultimo_revisado, foto_poliza)
                                        VALUES (@NuevoID, @Placa, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
                                        @FechaRenovacion, @FechaUltRevisado, @Foto)`);
        
        return result.rowsAffected[0];  
    } catch (error) {
        let MyThrow =  new Error(`No se pudo insertar el furgon, ${error.message}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;
        }

        HandleError(v1(), error.message, 'querys/Chassis/insertChassis/InsertChassis', error, 'user');
        throw MyThrow;
    }
}