import { pool } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { v1 } from 'uuid';

//Calcula el tiempo que le queda al usuario para volver a intentarlo
export const TimeRemaining = async (id_usuario) => {
    try {
        const result = await pool.request()
            .input("Id_usuario", sql.VarChar, id_usuario)
            .query(`SELECT 
                    DATEDIFF(SECOND, GETDATE(), fecha_suspencion) AS time
                    FROM [Troqueros].[dbo].[Usuarios] 
                    WHERE id_usuario = @Id_usuario`);

        const time = result.recordset[0].time;
        
        return time;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/login/timeRemaining/TimeRemaining', error, 'user');
        throw new Error('No se pudo calcular el tiempo de la suspención');
    }
}