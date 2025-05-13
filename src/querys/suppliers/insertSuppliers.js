import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Inserta un proveedor
export const InsertSupplier = async (supplier) => {
    try {
        const result = await pool.request()
            .input("Nombre", sql.VarChar, supplier.nombre)
            .input("PersonaContacto", sql.VarChar, supplier.personaContacto)
            .input("Celular", sql.VarChar, supplier.celular)
            .input("Telefono", sql.VarChar, supplier.telefono)
            .input("Email", sql.VarChar, supplier.email)
            .input("NumeroCuenta", sql.VarChar, supplier.numeroCuenta)
            .input("TipoBanco", sql.VarChar, supplier.tipoBanco)
            .query(`DECLARE @NuevoID CHAR(7);
                    EXEC Prc_GenerarIDProveedor @NuevoID OUTPUT
                    
                    INSERT INTO [Troqueros].[dbo].[Proveedores] (id_proveedor, nombre, persona_contacto, celular, 
                    telefono, email, numero_cuenta, tipo_Banco)
                    VALUES (@NuevoID, @Nombre, @PersonaContacto, @Celular, @Telefono,
                    @Email, @NumeroCuenta, @TipoBanco)`);
        
        return result.rowsAffected[0];  
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.POST)
        HandleError(code, error.message, 'querys/suppliers/insertSuppliers/InsertSuppliers', error);  
        throw new Error('Ha ocurrido un error al crear al proveedor');
    }
}