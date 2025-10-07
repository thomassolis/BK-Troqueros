import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import sql from 'mssql';
import { SaveFile } from '../../fileManager/saveFile.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';


export const InsertDriver = async (driver, files) => {
    let transaction = null;

    try {
        //validamos si file tiene datos
        if (files) {
            files = Object.assign({}, files);
        }

        transaction = new sql.Transaction(pool) // Instanciamos un objeto Transaction
        await transaction.begin() // Iniciamos la transaction

        //Generamos el ID del chasis antes del INSERT
        const idResult = await transaction.request()
            .query(`DECLARE @NuevoID CHAR(7);
                    EXEC Prc_GenerarIDConductores @NuevoID OUTPUT;
                    SELECT @NuevoID AS [id_conductor];`);
        
        //obtenemos el id del chasis
        const idDriver = idResult.recordset[0]?.id_conductor;

        //validamos que id del chasis exista
        if (!idDriver) {
            throw new Error('No se pudo generar el ID del chasis.');
        }

        //construimos la ruta de las carpetas
        const rutaLicencia = `conductores/${idDriver}/licencia`;
        const rutaPazSalvo = `conductores/${idDriver}/paz_a_salvo`;
        const rutaRecordPolicivo = `conductores/${idDriver}/record_policivo`;
        const rutaPasaporte = `conductores/${idDriver}/pasaporte`;


        const result = await transaction.request()
            .input("Cedula", sql.VarChar, driver.cedula)
            .input("Nombre", sql.VarChar, driver.nombre)
            .input("Apellido", sql.VarChar, driver.apellido)
            .input("Email", sql.VarChar, driver.email)
            .input("Contra", sql.VarChar, driver.pass)
            .input("Telefono", sql.VarChar, driver.telefono)
            .input("Status", sql.VarChar, driver.status)
            .input("Tipo_licencia", sql.Char, driver.tipo_licencia)
            .query(`
                    INSERT INTO [Conductores] ([id_conductor], [cedula], [nombre], [apellido],
                        [email], [contraseña], [telefono], [foto_licencia], [foto_PazYSalvo],
                        [foto_record_policivo], [foto_Pasaporte], [status], [tipo_licencia])
                        VALUES ('${idDriver}', @Cedula, @Nombre, @Apellido, @Email, @Contra, @Telefono, 
                            '${rutaLicencia}', '${rutaPazSalvo}', '${rutaRecordPolicivo}', '${rutaPasaporte}', @Status, @Tipo_licencia)                        
                `)
        
        //guardamos el archivo
        const fileSaved = files && files.licencia ? await SaveFile(rutaLicencia, files.licencia) : true;
        const fileSaved2 = files && files.pazSalvo ? await SaveFile(rutaPazSalvo, files.pazSalvo) : true;
        const fileSaved3 = files && files.recordPolicivo ? await SaveFile(rutaRecordPolicivo, files.recordPolicivo) : true;
        const fileSaved4 = files && files.pasaporte ? await SaveFile(rutaPasaporte, files.pasaporte) : true;

        //Valida que se haya guardado los archivos
        if (!fileSaved || !fileSaved2 || !fileSaved3 || !fileSaved4) {
            await transaction.rollback();
            throw new Error('Error al guardar los archivos. Se revirtió la transacción.');
        }

        // Valida que se haya hecho el insert
        if (result.rowsAffected > 0) {
            await transaction.commit();        
            return true;
        }

        await transaction.rollback();        
        return false;
    } catch (error) {
        // En caso de error revierte la transaction
        if (transaction) {
            await transaction.rollback()
        }

        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.POST);

        // Valida si el error ha sido por primary key o unique key
        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo insertar el chasis, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.message = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            } else {
                MyThrow.message = 'Favor de verificar la información a registrar. Cédula ya registrada.';
            }
            HandleError(code, error.message, 'querys/drivers/insertDriver/InsertDriver', error);
            throw MyThrow
        }
        
        HandleError(code, error.message, 'querys/drivers/insertDriver/InsertDriver', error);
        throw new Error('Ha ocurrido un error al crear el conductor');
    }
}