import { pool } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { v1 } from 'uuid';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Calcula el tiempo que le queda al usuario para volver a intentarlo
export const TimeRemaining = async (id_usuario) => {
    try {
        const result = await pool.request()
            .input("Id_usuario", sql.VarChar, id_usuario)
            .query(`SELECT 
                    DATEDIFF(SECOND, GETDATE(), fecha_suspencion) AS time
                    FROM [Usuarios] 
                    WHERE id_usuario = @Id_usuario`);

        const time = result.recordset[0].time;
        
        return time;
    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoAutenticado); //generar codigo del error
        HandleError(code, error.message, 'querys/login/timeRemaining/TimeRemaining', error);
        throw new Error('No se pudo calcular el tiempo de la suspención');
    }
}