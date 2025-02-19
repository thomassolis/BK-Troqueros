import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { UpdateSuppliers } from '../../querys/suppliers/updateSuppliers.js';

//controlador para actualizar los datos del cabezal
export const CtrUpdateSuppliers = async (req, res) => {
    try {
        const dataSuppliers = req.body; //obtiene los datos del request body       

        //valida que los datos no sean nulos
        if (!dataSuppliers) {
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        //Actualiza el proveedor
        const updatedTruckHead = await UpdateSuppliers(dataSuppliers);

        //valida que el proveedor se haya actualzido
        if (!updatedTruckHead) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el proveedor.'});
        }

        return res.status(200).json({success: true, message: 'Proveedor actualizado.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/suppliers/updateTruckSuppliersController/CtrUpdateSuppliers');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}