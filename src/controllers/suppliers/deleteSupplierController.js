import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { DeleteSupplier } from '../../querys/suppliers/deleteSupplier.js';

export const CtrDeleteSupplier = async (req, res) => {
    try {
        //obtiene el id del proveedor del request params
        const idSupplier = req.params.id;

        //valida que el id del proveedor no sea nulo
        if (!idSupplier) {
            return res.status(404).json({success: false, message: 'Proveedor inválido.'});
        }

        //elimina el proveedor del sistema
        const deletedSupplier = await DeleteSupplier(idSupplier);

        //valida que el proveedor se haya eliminado
        if (!deletedSupplier) {
            return res.status(404).json({success: false, message: 'Proveedor no encontrado.'});
        }

        return res.status(200).json({success: true, message: 'Proveedor eliminado correctamente.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/supplier/deleteTruckSupplierController/CtrDeleteSupplier', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}