import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Actualiza el proveedor con los datos de la request
export const UpdateSuppliers = async (supplier) => {
    try {
        const result = await pool.request()
                                .input("IdProveedor", sql.VarChar, supplier.id_proveedor)
                                .input("Nombre", sql.VarChar, supplier.nombre)
                                .input("PersonaContacto", sql.VarChar, supplier.personaContacto)
                                .input("Celular", sql.VarChar, supplier.celular)
                                .input("Telefono", sql.VarChar, supplier.telefono)
                                .input("Email", sql.VarChar, supplier.email)
                                .input("NumeroYappy", sql.VarChar, supplier.numeroYappy)
                                .input("NombreCuenta", sql.VarChar, supplier.nombreCuenta)
                                .input("NumeroCuenta", sql.VarChar, supplier.numeroCuenta)
                                .input("TipoBanco", sql.VarChar, supplier.tipoBanco)
                                .query(`UPDATE [Troqueros].[dbo].[Proveedores]
                                            SET [id_proveedor] = @IdProveedor,
                                                [nombre] = @Nombre,
                                                [persona_contacto] = @PersonaContacto,
                                                [celular] = @Celular, 
                                                [telefono] = @Telefono,
                                                [email] = @Email,
                                                [numero_yappy] = @NumeroYappy,
                                                [nombre_cuenta] = @NumeroCuenta,
                                                [numero_cuenta] = @NumeroCuenta,
                                                [tipo_Banco] = @TipoBanco,
                                                [fecha_modificación] = GETDATE()
                                        WHERE [id_proveedor] = @IdProveedor`);

        return result.rowsAffected[0];
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.PUT)
        HandleError(code, error.message, 'querys/suppliers/updateSuppliers/UpdateSuppliers', error);
        throw new Error('Ha ocurrido un error al actualizar la información del proveedor');
    }
}