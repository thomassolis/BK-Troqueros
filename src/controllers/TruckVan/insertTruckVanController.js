import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { InsertTruckVan } from '../../querys/TruckVan/insertTruckVan.js';

//controlador para insertar furgon
export const CtrInsertTruckVan = async (req, res) => {
    try {
        //obtiene los datos del request body
        const truckVan = req.body;

        //valida que los datos no sean nulos
        if (!truckVan){
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        const inserted = await InsertTruckVan(truckVan); //inserta los datos

        //valida que los datos se hayan insertados
        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo insertar el furgon.'});
        }

        return res.status(201).json({success: true, message: 'Furgon insertado.'});
    } catch (error) {
        if (error.ErrorCode === 2627) {
            return res.status(500).json({success: false, message: error.msg});
        }

        HandleError(v1(), error.message, 'controllers/TruckVan/insertTruckVanController/CtrInsertTruckVan', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}