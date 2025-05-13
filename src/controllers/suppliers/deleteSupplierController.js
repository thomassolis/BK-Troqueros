import { HandleError } from '../../utils/HandleError.js';
import { DeleteSupplier } from '../../querys/suppliers/deleteSupplier.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

export const CtrDeleteSupplier = async (req, res) => {
    try {
        //obtiene el id del proveedor del request params
        const idSupplier = req.params.id;

        //valida que el id del proveedor no sea nulo
        if (!idSupplier) {
            return res.status(400).json({ success: false, message: 'No se ha podido eliminar al proveedor. Identificador no proporcionado' })
        }

        //elimina el proveedor del sistema
        const deletedSupplier = await DeleteSupplier(idSupplier);

        //valida que el proveedor se haya eliminado
        if (!deletedSupplier) {
            return res.status(404).json({success: false, message: 'Proveedor no encontrado.'});
        }

        return res.status(200).json({success: true, message: 'Proveedor eliminado correctamente!.'});
    } catch (error) {
        const code = GenerateCodeError(modules.PROVEEDORES, typeError.PROVEEDORES.DELETE)
        HandleError(code, error.message, 'controllers/supplier/deleteSupplierController/CtrDeleteSupplier', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}