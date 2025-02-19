import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Inserta un proveedor
export const InsertSupplier = async (supplier) => {
    try {
        const result = await pool.request()
                                .input("Nombre", sql.VarChar, supplier.nombre)
                                .input("PersonaContacto", sql.VarChar, supplier.personaContacto)
                                .input("Celular", sql.Date, supplier.celular)
                                .input("Telefono", sql.Date, supplier.telefono)
                                .input("Email", sql.Date, supplier.email)
                                .input("NumeroCuenta", sql.Date, supplier.numeroCuenta)
                                .input("TipoBanco", sql.VarChar, supplier.tipoBanco)
                                .query(`DECLARE @NuevoID CHAR(7);
                                        EXEC Prc_GenerarIDProveedor @NuevoID OUTPUT
                                        
                                        INSERT INTO [Troqueros].[dbo].[Proveedores] (id_proveedor, nombre, persona_contacto, celular, 
                                        telefono, email, numero_cuenta, tipo_Banco)
                                        VALUES (@NuevoID, @Nombre, @PersonaContacto, @Celular, @Telefono,
                                        @Email, @NumeroCuenta, @TipoBanco)`);
        
        return result.rowsAffected[0];  
    } catch (error) {
        let MyThrow =  new Error(`No se pudo insertar el furgon, ${error.message}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;
        }

        HandleError(v1(), error.message, 'querys/suppliers/insertSuppliers/InsertSuppliers', error, 'user');  
        throw MyThrow;       
    }
}