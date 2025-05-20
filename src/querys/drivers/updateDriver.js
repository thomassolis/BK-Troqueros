import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { UpdateFile } from '../../fileManager/updateFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


export const UpdateDriverInfo = async (driver, files) => {
    let transaction = null;
    try {
        const cleanFiles = {}; // Instanciamos un nuevo objeto

        // Obtenemos los archivos
        // Guardamos lor archivos en el objeto creado
        Object.keys(files).forEach(key => {
            const value = files[key]; // Obtenemos la llave del objeto

            // Valida si el objeto es un array
            // De lo contrario lo convierte a un array
            cleanFiles[key] = Array.isArray(value) ? value : [value];
        });

        transaction = new sql.Transaction(pool); // Instanciamos un objeto Transaction
        await transaction.begin(); // Comienza la transacción

        // Construimos la ruta de las carpetas
        const rutaLicencia = `conductores/${driver.id_conductor}/licencia`;
        const rutaPazSalvo = `conductores/${driver.id_conductor}/paz_a_salvo`;

        const result = await transaction.request()
            .input("ID", sql.VarChar, driver.id_conductor)
            .input("Cedula", sql.VarChar, driver.cedula)
            .input("Nombre", sql.VarChar, driver.nombre)
            .input("Apellido", sql.VarChar, driver.apellido)
            .input("Email", sql.VarChar, driver.email)
            .input("Contra", sql.VarChar, driver.pass)
            .input("Telefono", sql.VarChar, driver.telefono)
            .query(`
                    UPDATE [Conductores]
                        SET [cedula] = @Cedula,
                            [nombre] = @Nombre,
                            [apellido] = @Apellido,
                            [email] = @Email,
                            [contraseña] = @Contra,
                            [telefono] = @Telefono,
                            [fecha_modificación] = GETDATE()
                    WHERE [id_conductor] = @ID
                `)
        
        // Valida que los archivos exista
        // Actualiza los archivos del conductor
        const fileUpdated = cleanFiles && cleanFiles.licencia ? await UpdateFile(rutaLicencia, cleanFiles.licencia) : await UpdateFile(rutaLicencia, null);
        const fileUpdated2 = cleanFiles && cleanFiles.pazSalvo ? await UpdateFile(rutaPazSalvo, cleanFiles.pazSalvo) : await UpdateFile(rutaPazSalvo, null);

        //Valida que se haya guardado los archivos
        if (!fileUpdated.success || !fileUpdated2.success) {
            await transaction.rollback();
            throw new Error('Error al actualizar los archivos. Se revirtió la transacción.');
        }

        // Valida que se haya hecho la actualización
        if (result.rowsAffected > 0) {
            await transaction.commit();            
            return true;
        }
        
        // Revierte la transaction
        await transaction.rollback();        
        return false;
    } catch (error) {
        //revierte la actualización del chasis
        if (transaction) {
            await transaction.rollback();
        }

        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.PUT);

        // Valida si el error ha sido por primary key o unique key
        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo actualizar el conductor, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('UQ_')) {
                MyThrow.message = 'La cedula insertada ya existe, favor de verificar la información a actualizar';
            } else {
                MyThrow.message = 'Ha ocurrido un error al actualizar la información del cliente';
            }

            HandleError(code, error.message, 'querys/drivers/updateDriver/UpdateDriverInfo', error);
            throw MyThrow;
        }
        
        HandleError(code, error.message, 'querys/drivers/updateDriver/UpdateDriverInfo', error);
        throw new Error('Ha ocurrido un error al actualizar la información del conductor');  
    }
}