import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Elimina un chasis del sistema
export const DeleteClient = async (id) => {
    try {
        //obtenemos las rutas de los archivos
        const path = await getPathClient(id);

        //valida que path exista
        if (!path) {
            return false;
        }        

        //eliminamos los archivos de poliza y revisado
        const eliminatedPoliza = await DeleteFile(path.copia_cedula_representante_legal);
        const eliminatedRevisado = await DeleteFile(path.copia_aviso_operaciones);

        //validamos que los archivos se hayan eliminado correctamente
        if (!eliminatedPoliza || !eliminatedRevisado) {
            throw new Error(`Error al eliminar los archivos, ${id}`);
        }
        
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`
                    DELETE [Troqueros].[dbo].[Clientes]
                    WHERE id_cliente = @Id
                `);

        // Valida si se ha eliminado el cliente
        if ( result.rowsAffected > 0) {
            return true
        }

        return false
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.DELETE);
        HandleError(code, error.message, 'querys/clients/deleteClient/DeleteClient', error);
        throw new Error('Ha ocurrido un error al eliminar el cliente');
    }
}


//funcion para obtener la ruta para eliminar el archivo junto con el registro
const getPathClient = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`
                    SELECT
                        copia_cedula_representante_legal,
                        copia_aviso_operaciones
                    FROM [Troqueros].[dbo].[Clientes]
                    WHERE id_cliente = @Id
                `);

        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.DELETE);
        HandleError(code, error.message, 'querys/clients/deleteClient/getPathClient', error);
        throw new Error('No se pudo obtener la ruta de los archivos del chasis');
    }
}