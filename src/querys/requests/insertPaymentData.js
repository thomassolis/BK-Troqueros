import { pool } from '../../db/db.js';

export const InsertPaymentData = async (client, paymentData, idRequest) => {
    try {
        for (const payment of paymentData) {
            const query = `
        INSERT INTO PagosPorPeticion (
          descripcion, montoPagado, referenciaBancaria, id_peticion
        ) VALUES ($1, $2, $3, $4)
      `;

            const values = [
                payment.descripcion || '',
                payment.montoPagado || 0,
                payment.comprobante || null,
                idRequest
            ];

            await client.query(query, values);
        }
    } catch (error) {
        console.error('Error insertando payment Data: ', error);
        throw error;
    }
};
