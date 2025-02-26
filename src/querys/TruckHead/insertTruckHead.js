import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { SaveFile } from '../../fileManager/saveFile.js';

//inserta un cabezal
export const InsertTruckHead = async (truckHead, folder, file) => {
    // Iniciar transacción
    const transaction = new sql.Transaction(pool);

    try {
        //validamos si file tiene datos
        if (file) {
            file = Object.assign({}, file);
        }

        // Comienza la transacción
        await transaction.begin();

        //Generamos el ID del chasis antes del INSERT
        const idResult = await transaction.request()
            .query(`DECLARE @NuevoID CHAR(7);
                    EXEC Prc_GenerarIDCabezal @NuevoID OUTPUT;
                    SELECT @NuevoID AS id_cabezal;`);
        
        //obtenemos el id del chasis
        const idCabezal = idResult.recordset[0].id_cabezal;

        //validamos que id del chasis exista
        if (!idCabezal) {
            throw new Error('No se pudo generar el ID del chasis.');
        }

        // Verifica si existen los archivos antes de definir la ruta en la base de datos.
        // Si el archivo "foto_poliza" está presente, se genera su ruta con el ID del chasis.
        // Si no existe, se asigna NULL en la base de datos para evitar errores.
        // Lo mismo aplica para "foto_revisado".
        const rutaPoliza = file && file.foto_poliza ? `'${folder[0]}/${idCabezal}/${folder[1]}'` : 'NULL';
        const rutaRevisado = file && file.foto_revisado ? `'${folder[0]}/${idCabezal}/${folder[2]}'` : 'NULL';

        //Hacemos el INSERT con las rutas generadas
        const result = await transaction.request()
            .input("Placa", sql.VarChar, truckHead.placa)
            .input("NumPoliza", sql.VarChar, truckHead.numPoliza)
            .input("FechaExpedicion", sql.Date, truckHead.fechaExpedicion)
            .input("FechaCaducidad", sql.Date, truckHead.fechaCaducidad)
            .input("FechaRenovacion", sql.Date, truckHead.fechaRenovacion)
            .input("FechaUltRevisado", sql.Date, truckHead.fechaUltRevisado)
            .query(`
                INSERT INTO [Troqueros].[dbo].[Cabezal] 
                (id_cabezal, placa, numero_poliza, fecha_expedicion_poliza, fecha_caducidad_poliza, 
                fecha_renovacion_revisado, fecha_ultimo_revisado, foto_poliza, foto_revisado)
                VALUES ('${idCabezal}', @Placa, @NumPoliza, @FechaExpedicion, @FechaCaducidad,
                        @FechaRenovacion, @FechaUltRevisado, ${rutaPoliza}, ${rutaRevisado})
            `);
        
        //guardamos el archivo
        const fileSaved = file && file.foto_poliza ? await SaveFile(folder[0], idCabezal, folder[1], file.foto_poliza) : true;
        const fileSaved2 = file && file.foto_revisado ? await SaveFile(folder[0], idCabezal, folder[2], file.foto_revisado) : true;

        //Valida que se haya guardado los archivos
        if (!fileSaved || !fileSaved2) {
            await transaction.rollback();
            throw new Error('Error al guardar los archivos. Se revirtió la transacción.');
        }

        // Si todo está bien, se realiza un commit y se hace el insert
        await transaction.commit();
        
        return true;
    } catch (error) {
        await transaction.rollback();

        let MyThrow =  new Error(`No se pudo insertar el furgon, ${error.message}`);

        if (error.number === 2627) {
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.msg = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            }

            MyThrow.msg = 'La placa ya existe.';
        }

        HandleError(v1(), error.message, 'querys/TruckHead/insertTruckHead/InsertTruckHead', error, 'user');
        throw MyThrow;
    }
}