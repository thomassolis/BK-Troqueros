import { HandleError } from '../../utils/HandleError.js';
import { GetSuppleirId } from '../../querys/suppliers/getSuppliersId.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene un proveedor del sistema
export const CtrGetSuppliersId = async (req, res) => {
    try {
        //obtiene el id del proveedor
        const idSupplier = req.params.id;

        //valida que el id del proveedor no sea nulo
        if (!idSupplier) {
            return res.status(400).json({success: false, message: 'Ha ocurrido un error al obtener la información del proveedor'});
        }

        //obtiene la info del proveedor y reduce el anidamiento del array
        const supplier = await GetSuppleirId(idSupplier);

        //verifica que proveedor no este nulo
        if (!supplier) {
            return res.status(404).json({success: false, message: 'Proveedor no encontrado'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: supplier});
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.GET)
        HandleError(code, error.message, 'controllers/suppliers/getSuppliersIdController/CtrGetSuppliersId', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}