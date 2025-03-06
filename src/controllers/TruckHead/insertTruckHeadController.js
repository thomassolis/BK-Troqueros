import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { InsertTruckHead } from '../../querys/TruckHead/insertTruckHead.js';

//controlador para insertar cabezal
export const CtrInsertTruckHead = async (req, res) => {
    try {
        //obtiene los datos del request body
        const truckHead = req.body;
        const file = req.files;

        //valida que los datos no sean nulos
        if (!truckHead){
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        const inserted = await InsertTruckHead(truckHead, file); //inserta los datos

        //valida que los datos se hayan insertados
        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo insertar el cabezal.'});
        }

        return res.status(201).json({success: true, message: 'Cabezal insertado.'});
    } catch (error) {
        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            return res.status(500).json({success: false, message: error.msg});
        }
        
        HandleError(v1(), error.message, 'controllers/TruckHead/insertTruckHeadController/CtrInsertTruckHead', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}