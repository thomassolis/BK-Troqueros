import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateSupplier } from '../../querys/suppliers/activateSupplier.js';


export const Ctr_ActivateSupplier = async (req, res) => {
    try {
        const supplier = req.body;

        // Validamos que el proveedor no sea undefined
        if (!supplier || !Object.keys(supplier).length) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activatedSupplier = await ActivateSupplier(supplier) // Habilita/Deshabilita el proveedor

        // Validamos que se haya habilitado/deshabilitado el proveedor
        if (!activatedSupplier) {
            return res.status(400).json({ success: false, message: supplier.active ? 'No se pudo habilitar el proveedor.' : 'No se pudo deshabilitar el proveedor.' })
        }

        return res.status(200).json({ success: true, message: supplier.active ? 'Proveedor habilitado.' : 'Proveedor deshabilitado.' })
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.PATCH)
        HandleError(code, error.message, 'controllers/suppliers/activateSuppliersController/Ctr_ActivateSupplier');
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}