import { pool } from '../../db/db.js';
import sql from 'mssql';
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
            INSERT INTO [Servicios_datos] ([id_servicio], [nombre], [lugar_origen], [lugar_destino], [tarifa])
            VALUES 
        `;

        const request = await transaction.request();
        request.input("IDServicio", sql.Int, idService)

        let values = []

        infoService.forEach((item, index) => {            
            request.input(`Origen${index}`, sql.VarChar, item.lugar_origen)
            request.input(`Destino${index}`, sql.VarChar, item.lugar_destino)
            request.input(`Tarifa${index}`, sql.Decimal, item.tarifa)

            // Agrega los valores a una lista
            values.push(`(@IDServicio, '', @Origen${index}, @Destino${index}, @Tarifa${index})`)
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