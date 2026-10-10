import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import crypto from 'crypto';

//Inserta un proveedor
export const InsertSupplier = async (supplier) => {
    try {
        const idProveedor = crypto.randomUUID().slice(0, 7);

        const result = await pool.request()
            .input("ID", sql.VarChar, idProveedor)
            .input("Nombre", sql.VarChar, supplier.nombre)
            .input("PersonaContacto", sql.VarChar, supplier.personaContacto)
            .input("Celular", sql.VarChar, supplier.celular)
            .input("Telefono", sql.VarChar, supplier.telefono)
            .input("Email", sql.VarChar, supplier.email)
            .input("NumeroYappy", sql.VarChar, supplier.numeroYappy)
            .input("NombreCuenta", sql.VarChar, supplier.nombreCuenta)
            .input("NumeroCuenta", sql.VarChar, supplier.numeroCuenta)
            .input("TipoBanco", sql.VarChar, supplier.tipoBanco)
            .query(`INSERT INTO [Proveedores] ([id_proveedor], [nombre], [persona_contacto], 
                        [celular], [telefono], [email], [numero_yappy], [nombre_cuenta], [numero_cuenta], [tipo_Banco])
                    VALUES (@ID, @Nombre, @PersonaContacto, @Celular, @Telefono,
                        @Email, @NumeroYappy, @NombreCuenta, @NumeroCuenta, @TipoBanco)`);
        
        return result.rowsAffected[0];  
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.POST)
        HandleError(code, error.message, 'querys/suppliers/insertSuppliers/InsertSuppliers', error);  
        throw new Error('Ha ocurrido un error al crear al proveedor');
    }
}