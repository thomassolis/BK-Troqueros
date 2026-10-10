import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza la ruta de un servicio
export const UpdRutaService = async (service) => {
    try {
        const result = await pool.request()
            .input("ID", sql.Int, service.id_servicio_datos)
            .input("Origen", sql.VarChar, service.lugar_origen)
            .input("Destino", sql.VarChar, service.lugar_destino)
            .input("Tarifa", sql.Decimal, service.tarifa)
            .input("TiempoEstimado", sql.Float, service.tiempo_estimado)
            .query(`
                    UPDATE [Servicios_datos]
                        SET [lugar_origen] = @Origen,
                            [lugar_destino] = @Destino,
                            [tarifa] = @Tarifa,
                            [tiempo_estimado] = @TiempoEstimado
                    WHERE [id_servicio_datos] = @ID
                `);
        
        // Valida que se haya hecho la actualización de la ruta del servicio
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PUT);
        HandleError(code, error.message, 'querys/services/updateRutaServices/UpdateDataServices', error);
        throw new Error('Ha ocurrido un error al actualizar la información del servicio');
    }
}