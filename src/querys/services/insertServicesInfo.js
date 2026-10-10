import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Inserta las rutas de los servicios
export const InsertDataServices = async (transaction, infoService, idService) => {
    try {
        // Valida si el servicio tiene información de las rutas
        if (infoService.length === 0) {
            return true; // Si es false, retorna true
        }
        
        let query = `
            INSERT INTO [Servicios_datos] ([id_servicio], [nombre], [lugar_origen], [lugar_destino], [tarifa], [tiempo_estimado])
            VALUES 
        `;

        const request = await transaction.request();
        request.input("IDServicio", sql.Int, idService)

        let values = []

        infoService.forEach((item, index) => {            
            request.input(`Origen${index}`, sql.VarChar, item.lugar_origen)
            request.input(`Destino${index}`, sql.VarChar, item.lugar_destino)
            request.input(`Tarifa${index}`, sql.Decimal, item.tarifa)
            request.input(`TiempoEstimado${index}`, sql.Float, item.tiempo_estimado)

            // Agrega los valores a una lista
            values.push(`(@IDServicio, '', @Origen${index}, @Destino${index}, @Tarifa${index}, @TiempoEstimado${index})`)
        });

        query += values.join(', '); // Construye la consulta con los valores a insertar

        const result = await request.query(query);

        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);
        HandleError(code, error.message, 'querys/services/insertServicesInfo/InsertDataServices', error);
        throw new Error('Ha ocurrido un error al crear el servicio');
    }
}



// Agrega una nueva ruta a un servicio ya existente
export const InsertNewDataServices = async (infoService) => {
    try {
        const result = await pool.request()
            .input("IDServicio", sql.Int, infoService.id_servicio)
            .input("Origen", sql.VarChar, infoService.lugar_origen)
            .input("Destino", sql.VarChar, infoService.lugar_destino)
            .input("Tarifa", sql.Decimal, infoService.tarifa)
            .input("TiempoEstimado", sql.Float, infoService.tiempo_estimado)
            .query(`
                    INSERT INTO [Servicios_datos] ([id_servicio], [nombre], 
                    [lugar_origen], [lugar_destino], [tarifa], [tiempo_estimado])
                        VALUES (@IDServicio, '', @Origen, @Destino, @Tarifa, @TiempoEstimado)
                `);

        // Valida que se haya hecho el insert de la nueva ruta del servicio
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);
        HandleError(code, error.message, 'querys/services/insertServicesInfo/InsertNewDataServices', error);
        throw new Error('Ha ocurrido un error al agregar una nueva ruta al servicio');
    }
}