import sql from 'mssql';

export const InsertPaymentData = async(transaction, paymentData, idRequest) => {        
    try{
        for(const payment of paymentData){
            const result = await transaction.request()
            .input("descripcion", sql.VarChar(50), payment.descripcion || '')
            .input('montoPagado', sql.Float, payment.montoPagado || 0)
            .input('referenciaBancaria', sql.VarChar(80), payment.comprobante)
            .input('id_peticion', sql.VarChar, idRequest)
            .query(`
                INSERT INTO [PagosPorPeticion] (
                    descripcion, montoPagado, referenciaBancaria, id_peticion
                ) VALUES (
                    @descripcion, @montoPagado, @referenciaBancaria, @id_peticion
                )
            `)
        }
    }catch(error){
        console.error('Error insertando payment Data: ', error);
    }
}