
import { pool } from "../../db/db.js";
import sql from 'mssql';
export const PostVacioEntregado = async(data) => {
    console.log('data', data);
    try{
        const result = await pool.request()
        .input("value", sql.Bit, data.value)
        .input("id_Pedido_Servicio", sql.Int, data.idPedidoServicio)
        .query(`
                UPDATE [Troqueros].[dbo].[Pedido_Servicio]
                    SET vacio_entregado = @value
                    WHERE id_Pedido_Servicio = @id_Pedido_Servicio;
        `)        
        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    }catch(error){
        console.error('Error en PostVacioEntregado', error);
    }
}