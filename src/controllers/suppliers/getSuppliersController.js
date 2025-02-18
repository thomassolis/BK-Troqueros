import { v1 } from 'uuid'
import { HandleError } from '../../utils/HandleError.js'
import { GetSuppliers } from '../../querys/suppliers/getSuppliers.js';

//Obtiene todos los proveedores que hay en el sistema
export const CtrGetSuppliers = async (req, res) => {
    try {
        //obtiene toda la data de los proveedores y reduce el anidamiento
        const suppliers = (await GetSuppliers()).flat();

        //valida que no sea nulo
        if (!suppliers) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: suppliers});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/suppliers/getSuppliersController/CtrGetSuppliers', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}