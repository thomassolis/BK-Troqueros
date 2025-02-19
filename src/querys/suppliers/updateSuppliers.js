import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Actualiza el proveedor con los datos de la request
export const UpdateSuppliers = async (supplier) => {
    try {
        const result = await pool.request()
                                .input("IdProveedor", sql.Char(7), supplier.id_proveedor)
                                .input("Nombre", sql.VarChar, supplier.nombre)
                                .input("PersonaContacto", sql.VarChar, supplier.personaContacto)
                                .input("Celular", sql.Date, supplier.celular)
                                .input("Telefono", sql.Date, supplier.telefono)
                                .input("Email", sql.Date, supplier.email)
                                .input("NumeroCuenta", sql.Date, supplier.numeroCuenta)
                                .input("TipoBanco", sql.VarChar, supplier.tipoBanco)
                                .query(`UPDATE [Troqueros].[dbo].[Proveedores]
                                            SET id_proveedor = @IdProveedor,
                                                nombre = @Nombre,
                                                persona_contacto = @PersonaContacto,
                                                celular = @Celular, 
                                                telefono = @Telefono,
                                                email = @Email,
                                                numero_cuenta = @NumeroCuenta,
                                                tipo_Banco = @TipoBanco,
                                                fecha_modificación = GETDATE()
                                        WHERE id_proveedor = @IdProveedor`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/suppliers/updateSuppliers/UpdateSuppliers');
        throw new Error('No se pudo actualizar el proveedor');
    }
}