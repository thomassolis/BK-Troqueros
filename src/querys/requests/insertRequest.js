import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertOrderServices } from './insertOrderService.js';
import { GetTime } from '../../auxiliary functions/dateConverter.js';
import { InsertPaymentData } from './insertPaymentData.js';
import { InsertPaymentFiles } from './insertPaymentFiles.js';
import { GetTotalPricePerService } from '../../auxiliary functions/functionAuxiliary.js';
import crypto from 'crypto';

// Crea una nueva petición
export const InsertNewRequest = async (request, files, userData) => {
    const client = await pool.connect(); // obtenemos un cliente de pg
    try {
        request.hora_salida = GetTime(request.hora_salida); // "HH:MM:SS"

        await client.query('BEGIN'); // iniciamos transacción

        // Generamos el ID de la petición (en PostgreSQL puedes usar un sequence o uuid)
        const idRequest = crypto.randomUUID().slice(0, 9); // ejemplo: simular CHAR(9)

        if (!idRequest) {
            throw new Error('Ha ocurrido un error al crear la petición');
        }

        let monto = GetTotalPricePerService(request.servicios || []); // Obtiene el monto total de los servicios
        let profit = 0; // Declaramos el profit con valor inicial de 0

        // Valida si la petición es por proveedor
        // Calcula el profit
        if (request?.precio_proveedor) {
            profit = request.servicios[0].tarifa - request.precio_proveedor;
        }

        const insertQuery = `
      INSERT INTO Peticiones (
        id_peticion, cliente_id, proveedor_id, precio_proveedor, profit, precio_total,
        fecha_salida, hora_salida, status, numero_factura, creado_por
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::time, $9, $10, $11)
    `;

        const values = [
            idRequest,
            request.id_cliente,
            request.id_proveedor || null,
            request.precio_proveedor || 0,
            profit,
            monto,
            request.fecha_salida,
            request.hora_salida,
            request.status || 'En espera',
            request.numero_factura || null,
            userData.id_usuario || null
        ];

        const result = await client.query(insertQuery, values);

        if (result.rowCount > 0) {
            // Agrega los servicios de la petición
            const addedServices = await InsertOrderServices(client, request.servicios, idRequest);

            if (Array.isArray(request.paymentData) && request.paymentData.length > 0) {
                await InsertPaymentData(client, request.paymentData, idRequest);
            }

            if (files?.paymentFiles) {
                await InsertPaymentFiles(client, files.paymentFiles, idRequest);
            }

            if (addedServices) {
                await client.query('COMMIT');
                return true;
            }
        }

        await client.query('ROLLBACK');
        return false;
    } catch (error) {
        console.error('error en InsertNewRequest', error);
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'querys/requests/insertRequests/InsertNewRequest', error);

        await client.query('ROLLBACK');
        throw new Error('Ha ocurrido un error al crear una nueva petición');
    } finally {
        client.release(); // liberamos el cliente
    }
};
