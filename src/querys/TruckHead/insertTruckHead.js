import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

export const InsertTruckHead = async (truckHead) => {
    try {
        const result = await pool.request()
                                .input("Placa", sql.VarChar, truckHead.placa)
                                .input("NumPoliza", sql.VarChar, truckHead.numPoliza)
                                .input("FechaExpedicion", sql.Date, truckHead.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, truckHead.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, truckHead.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, truckHead.fechaUltRevisado)
                                .input("Foto", sql.VarChar, truckHead.foto)
                                .query(`DECLARE @NuevoID CHAR(7);
                                        EXEC GenerarIDCabezal @NuevoID OUTPUT
                                        
                                        INSERT INTO [Troqueros].[dbo].[Cabezal] (id_cabezal, placa, numero_poliza, 
                                        fecha_expedicion_poliza, fecha_caducidad_poliza, fecha_renovacion_revisado,
                                        fecha_ultimo_revisado, foto_poliza)
                                        VALUES (@NuevoID, @Placa, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
                                        @FechaRenovacion, @FechaUltRevisado, @Foto)`);
        
        return result.rowsAffected[0];  
    } catch (error) {
        let MyThrow =  new Error(`No se pudo insertar el furgon, ${error.message}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.msg = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            }

            MyThrow.msg = 'La placa ya existe.';
        }

        HandleError(v1(), error.message, 'querys/TruckHead/insertTruckHead/InsertTruckHead', error, 'user');
        throw MyThrow;
    }
}