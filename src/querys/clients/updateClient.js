import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import sql from 'mssql';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';
import { UpdateFile } from '../../fileManager/updateFile.js';


// Actualiza la información del cliente
export const UpdateClient = async (client, files) => {
    let transaction = null
    try {
        // Valida que la información no sea undefined
        if (!client) {
            return null
        }

        const cleanFiles = {}; // Instanciamos un nuevo objeto

        // Obtenemos los archivos
        // Guardamos lor archivos en el objeto creado
        Object.keys(files).forEach(key => {
            const value = files[key]; // Obtenemos la llave del objeto

            // Valida si el objeto es un array
            // De lo contrario lo convierte a un array
            cleanFiles[key] = Array.isArray(value) ? value : [value];
        });

        transaction = new sql.Transaction(pool) // Instanciamos un objeto Transaction
        await transaction.begin() // Iniciamos la transaction

        //construimos la ruta de las carpetas
        const rutaCed = `clientes/${client.id_cliente}/cedula_representante_legal`;
        const rutaAvisoOpe = `clientes/${client.id_cliente}/aviso_operaciones`;

        const result = await transaction.request()
            .input("ID", sql.VarChar, client.id_cliente)
            .input("Nombre", sql.VarChar, client.nombre)
            .input("Ruc", sql.VarChar, client.ruc)
            .input("Direccion", sql.VarChar, client.direccion)
            .input("NombreContacto", sql.VarChar, client.nombrePersonaContacto)
            .input("TelContacto", sql.VarChar, client.telPersonaContacto)
            .input("EmailContacto", sql.VarChar, client.emailContactoFinanciero)
            .input("NumeroCuenta", sql.VarChar, client.numeroCuenta)
            .input("NombreBanco", sql.VarChar, client.nombreBanco)
            .input("TipoCuenta", sql.VarChar, client.tipoCuenta)
            .input("NombreCuenta", sql.VarChar, client.nombreCuenta)
            .query(`
                    UPDATE Clientes
                        SET [nombre] = @Nombre,
                            [ruc_empresa] = @Ruc,
                            [direccion] = @Direccion,
                            [nombre_persona_contacto] = @NombreContacto,
                            [telefono_persona_contacto] = @TelContacto,
                            [email_persona_contacto] = @EmailContacto,
                            [numero_cuenta] = @NumeroCuenta,
                            [nombre_banco] = @NombreBanco,
                            [tipo_cuenta] = @TipoCuenta,
                            [nombre_cuenta] = @NombreCuenta,
                            [fecha_modificación] = GETDATE()
                    WHERE id_cliente = @ID
                `)

        //valida que los archivos exista
        //actualiza los archivos del chasis
        const fileEliminated = cleanFiles && cleanFiles.cedRepresentanteLegal ? await UpdateFile(rutaCed, cleanFiles.cedRepresentanteLegal) : await UpdateFile(rutaCed, null);
        const fileEliminated2 = cleanFiles && cleanFiles.avisoOperaciones ? await UpdateFile(rutaAvisoOpe, cleanFiles.avisoOperaciones) : await UpdateFile(rutaAvisoOpe, null);

        //Valida que se haya guardado los archivos
        if (!fileEliminated.success || !fileEliminated2.success) {
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
        // En caso de error revierte la transaction
        if (transaction) {
            await transaction.rollback()
        }

        // Valida si el error es por violación a la Unique Key (RUC)
        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo actualizar la información del cliente, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('UQ_')) {
                MyThrow.message = 'El Ruc ya existe, favor de verificar la información a actualizar';
            } else {
                MyThrow.message = 'Ha ocurrido un error al actualizar la información del cliente';
            }

            throw MyThrow;
        }

        const code = GenerateCodeError(modules.CLIENTES, typeError.CLIENTES.PUT);
        HandleError(code, error.message, 'querys/clients/updateClient/UpdateClient', error);
        throw new Error('Ha ocurrido un error al actualizar la información del cliente');
    }
}