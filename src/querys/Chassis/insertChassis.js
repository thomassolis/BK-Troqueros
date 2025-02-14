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
                                .execute(``);
        
        return result.rowsAffected[0];  
    } catch (error) {
        HandleError(v1(), error.message, 'querys/Chassis/InsertChassis', error, 'user');
        throw new Error('No se pudo insertar el chasis', error.message);
    }
}