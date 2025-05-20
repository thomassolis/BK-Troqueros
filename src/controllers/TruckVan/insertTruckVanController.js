import { HandleError } from '../../utils/HandleError.js';
import { InsertTruckVan } from '../../querys/TruckVan/insertTruckVan.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';

//controlador para insertar furgon
export const CtrInsertTruckVan = async (req, res) => {
    try {
        //obtiene los datos del request body
        const truckVan = req.body;
        const file = req.files;
        
        const inserted = await InsertTruckVan(truckVan, file); //inserta los datos

        //valida que los datos se hayan insertados
        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo insertar el furgon.'});
        }

        return res.status(201).json({success: true, message: 'Furgon insertado.'});
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.POST);

        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/TruckVan/insertTruckVanController/CtrInsertTruckVan', error);
            return res.status(500).json({success: false, message: error.message});
        }

        HandleError(code, error.message, 'controllers/TruckVan/insertTruckVanController/CtrInsertTruckVan', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}