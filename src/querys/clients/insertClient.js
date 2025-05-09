import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import sql from 'mssql';
import { SaveFile } from '../../fileManager/saveFile.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';


export const InsertClient = async (data, files) => {
    let transaction = null
    try {
        // Valida que la información no sea undefined
        if (!data) {
            return null
        }

        //validamos si file tiene datos
        if (files) {
            files = Object.assign({}, files);
        }

        transaction = new sql.Transaction(pool) // Instanciamos un objeto Transaction
        transaction.begin() // Iniciamos la transaction

        const id = await CreateIDClient(data.nombre) // Crea el ID del cliente

        //construimos la ruta de las carpetas
        const rutaCed = `clientes/${id}/cedula_representante_legal`;
        const rutaAvisoOpe = `clientes/${id}/aviso_operaciones`;

        const result = await transaction.request()
            .input("ID", sql.VarChar, id)
            .input("Nombre", sql.VarChar, data.nombre)
            .input("Ruc", sql.VarChar, data.ruc)
            .input("Direccion", sql.VarChar, data.direccion)
            .input("NombreContacto", sql.VarChar, data.nombrePersonaContacto)
            .input("TelContacto", sql.VarChar, data.telPersonaContacto)
            .input("EmailContacto", sql.VarChar, data.emailContactoFinanciero)
            .input("NumeroCuenta", sql.VarChar, data.numeroCuenta)
            .input("NombreBanco", sql.VarChar, data.nombreBanco)
            .input("TipoCuenta", sql.VarChar, data.tipoCuenta)
            .input("NombreCuenta", sql.VarChar, data.nombreCuenta)
            .query(`
                    INSERT INTO Clientes ([id_cliente], [nombre], [nombre_persona_contacto], [email_persona_contacto],
                                            [telefono_persona_contacto], [ruc_empresa], [direccion], [numero_cuenta],
                                            [nombre_banco], [tipo_cuenta], [nombre_cuenta], tipo_cliente,
                                            [copia_cedula_representante_legal], [copia_aviso_operaciones])
                        VALUES(@ID, @Nombre, @NombreContacto, @EmailContacto, @TelContacto, @Ruc, 
                            @Direccion, @NumeroCuenta, @NombreBanco, @TipoCuenta, @NombreCuenta, '', '${rutaCed}', '${rutaAvisoOpe}')
                `)

         //guardamos el archivo
        const fileSaved = files && files.cedRepresentanteLegal ? await SaveFile(rutaCed, files.cedRepresentanteLegal) : true;
        const fileSaved2 = files && files.avisoOperaciones ? await SaveFile(rutaAvisoOpe, files.avisoOperaciones) : true;

        //Valida que se haya guardado los archivos
        if (!fileSaved || !fileSaved2) {
            await transaction.rollback();
            throw new Error('Error al guardar los archivos. Se revirtió la transacción.');
        }
        
        // Valida que se haya hecho el insert
        if (result.rowsAffected > 0) {
            transaction.commit()
            return true
        }

        transaction.rollback()
        return false
    } catch (error) {
        // En caso de error revierte la transaction
        if (transaction) {
            transaction.rollback()
        }

        const code = GenerateCodeError(modules.CLIENTES, typeError.CLIENTES.POST);
        HandleError(code, error.message, 'querys/Clients/insertClient/InsertClient', error);
        throw new Error('Ha ocurrido un error al crear al cliente');
    }
}


// Obtiene el ultimo ID relacionado
const GetLastID = async (idClient) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, idClient)
            .query(`
                    SELECT TOP 1 id_cliente FROM Clientes
                    WHERE id_cliente LIKE @ID + '%'
                    ORDER BY fecha_creacion DESC
                `)

        return result.recordset[0].id_cliente
    } catch (error) {
        throw new Error(`Error en al obtener el último ID, ${error}`);
    }
}


// Crea el ID del cliente
const CreateIDClient = async (nameClient) => {
    try {
        const listWords = nameClient.split(' ');
        let id = '' // Inicializamos el ID con una cadena vacía

        // Recorremos y creamos el id tomando los tres primeros caracteres de las dos primeras palabras
        for (let i = 0; i < Math.min(2, listWords.length); i++){
            id += listWords[i].slice(0, 3)
        }

        if (!id) {
            throw new Error('ID no creado');            
        }

        const lastID = await GetLastID(id) // Obtenemos el ultimo ID

        if (!lastID) {
            return id
        }

        let [, base, numStr] = lastID.match(/^(.+?)(\d+)?$/); // Divide letras y numeros
        let sufijo = parseInt(numStr) || 0; // Obtenemos la secuencia del ID

        return base + (sufijo + 1).toString();
    } catch (error) {
        throw new Error(`Error al crear el ID del cliente, ${error}`);
    }
}