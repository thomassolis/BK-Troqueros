import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Inserta un furgon
export const InsertTruckVan = async (truckVan) => {
    try {
        const result = await pool.request()
                                .input("Placa", sql.VarChar, truckVan.placa)
                                .input("NumPoliza", sql.VarChar, truckVan.numPoliza)
                                .input("FechaExpedicion", sql.Date, truckVan.fechaExpedicion)
                                .input("FechaCaducidad", sql.Date, truckVan.fechaCaducidad)
                                .input("FechaRenovacion", sql.Date, truckVan.fechaRenovacion)
                                .input("FechaUltRevisado", sql.Date, truckVan.fechaUltRevisado)
                                .input("Foto", sql.VarChar, truckVan.foto)
                                .query(`DECLARE @NuevoID CHAR(7);
                                        EXEC GenerarIDFurgon @NuevoID OUTPUT
                                        
                                        INSERT INTO [Troqueros].[dbo].[Furgon] (id_furgon, placa, numero_poliza, 
                                        fecha_expedicion_poliza, fecha_caducidad_poliza, fecha_renovacion_revisado,
                                        fecha_ultimo_revisado, foto_poliza)
                                        VALUES (@NuevoID, @Placa, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
                                        @FechaRenovacion, @FechaUltRevisado, @Foto)`);
        
        return result.rowsAffected[0];  
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckVan/insertTruckVan/InsertTruckVan', error, 'user');
        throw new Error('No se pudo insertar el furgon');
    }
}