import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetSuppleirId } from '../../querys/suppliers/getSuppliersId.js';

//Obtiene un proveedor del sistema
export const CtrGetSuppliersId = async (req, res) => {
    try {
        //obtiene el id del proveedor
        const idSupplier = req.params.id;

        //valida que el id del proveedor no sea nulo
        if (!idSupplier) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos del proveedor'});
        }

        //obtiene la info del proveedor y reduce el anidamiento del array
        const supplier = await GetSuppleirId(idSupplier);

        //verifica que proveedor no este nulo
        if (!supplier) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos del proveedor'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: supplier});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/suppliers/getSuppliersIdController/CtrGetSuppliersId', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}