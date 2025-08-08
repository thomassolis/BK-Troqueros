import { PostVacioEntregado } from "../../querys/agenda/postVacioEntregado.js";

export const Ctr_PostisEmptyDelivered = async(req, res) => {
    try{
        const {value, idPedidoServicio} = req.body;
        const data = {value, idPedidoServicio}
        
        const vacioEntregadoStatus = await PostVacioEntregado(data)
        return res.status(200).json({ success: true, message: 'Vacío Actualizado' })
    }catch(error){
        console.error('Error en Ctr_PostisEmptyDelivered', error);
    }
}