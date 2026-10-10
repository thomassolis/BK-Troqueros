import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import { SaveFile } from '../../fileManager/saveFile.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';


// Agrega un nuevo cliente
export const InsertClient = async (data, files) => {    
    let client = null;
    try {
        // Valida que la información no sea undefined
        if (!data) {
            return null
        }

        //validamos si file tiene datos
        if (files) {
            files = Object.assign({}, files);
        }

        client = await pool.connect();
        await client.query('BEGIN'); // Iniciamos la transaction

        const id = await CreateIDClient(client, data.nombre) // Crea el ID del cliente

        //construimos la ruta de las carpetas
        const rutaCed = `clientes/${id}/cedula_representante_legal`;
        const rutaAvisoOpe = `clientes/${id}/aviso_operaciones`;
        const rutaCedPerNatural = `clientes/${id}/cedula_persona_natural`;

        const insertQuery = `
            INSERT INTO Clientes (
                id_cliente, nombre, nombre_persona_contacto, email_persona_contacto,
                telefono_persona_contacto, ruc_empresa, DV, direccion, numero_cuenta,
                nombre_banco, tipo_cuenta, nombre_cuenta, copia_cedula_representante_legal, 
                copia_aviso_operaciones, cedula_persona_natural
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
            )
        `;

        const values = [
            id,
            data.nombre,
            data.nombrePersonaContacto,
            data.emailPersonaContacto,
            data.telPersonaContacto,
            data.ruc,
            data.dv,
            data.direccion,
            data.numeroCuenta,
            data.nombreBanco,
            data.tipoCuenta,
            data.nombreCuenta,
            rutaCed,
            rutaAvisoOpe,
            rutaCedPerNatural
        ];

        const result = await client.query(insertQuery, values);
                
         //guardamos el archivo
        const fileSaved = files && files.cedRepresentanteLegal ? await SaveFile(rutaCed, files.cedRepresentanteLegal) : true;
        const fileSaved2 = files && files.avisoOperaciones ? await SaveFile(rutaAvisoOpe, files.avisoOperaciones) : true;
        const fileSaved3 = files && files.cedPersonaNatural ? await SaveFile(rutaCedPerNatural, files.cedPersonaNatural) : true;

        //Valida que se haya guardado los archivos
        if (!fileSaved || !fileSaved2 || !fileSaved3) {
            await client.query('ROLLBACK');
            throw new Error('Error al guardar los archivos. Se revirtió la transacción.');
        }
        
        // Valida que se haya hecho el insert
        if (result.rowCount > 0) {
            await client.query('COMMIT');
            return true
        }

        await client.query('ROLLBACK');
        return false
    } catch (error) {
        // En caso de error revierte la transaction
        if (client) {
            await client.query('ROLLBACK');
        }
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.POST);
        HandleError(code, error.message, 'querys/Clients/insertClient/InsertClient', error);
        throw new Error('Ha ocurrido un error al crear al cliente');
    } finally {
        if (client) {
            client.release();
        }
    }
}


// Obtiene el ultimo ID relacionado
const GetLastID = async (client, idClient) => {
    try {
        const query = `
            SELECT id_cliente FROM Clientes
            WHERE id_cliente LIKE $1 || '%'
            ORDER BY fecha_creacion DESC
            LIMIT 1
        `;
        const result = await client.query(query, [idClient]);
        return result.rows[0]?.id_cliente
    } catch (error) {
        throw new Error(`Error en al obtener el último ID, ${error.message}`);
    }
}


// Crea el ID del cliente
const CreateIDClient = async (client, nameClient) => {
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

        const lastID = await GetLastID(client, id) // Obtenemos el ultimo ID

        if (!lastID) {
            return id
        }

        let [, base, numStr] = lastID.match(/^(.+?)(\d+)?$/); // Divide letras y numeros
        let sufijo = parseInt(numStr) || 0; // Obtenemos la secuencia del ID

        return base + (sufijo + 1).toString();
    } catch (error) {
        throw new Error(`Error al crear el ID del cliente, ${error.message}`);
    }
}