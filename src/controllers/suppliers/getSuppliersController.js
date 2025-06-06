import { HandleError } from '../../utils/HandleError.js'
import { GetSuppliers, GetSuppliersByFilter } from '../../querys/suppliers/getSuppliers.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los proveedores que hay en el sistema
export const CtrGetSuppliers = async (req, res) => {
    try {
        const search = req.query.search; // Obtenemos la palabra a buscar
        const page = parseInt(req.query.page) || 1; // Obtiene la página actual
        let active = req.query.active ? req.query.active : true;
        active = active === 'true' || active === true

        let suppliers = null

        //Valida si ha ingresado una palabra a buscar
        if (search) {
            //obtiene los proveedores filtrados
            suppliers = await GetSuppliersByFilter(page, search, active);
        } else {
            //obtiene toda la data de los proveedores
            suppliers = await GetSuppliers(page, active);
        }        

        //valida que no sea nulo
        if (!suppliers) {
            return res.status(404).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: suppliers});
    } catch (error) {
        const code = GenerateCodeError(modules.PROVEEDORES, typeError.PROVEEDORES.GET)
        HandleError(code, error.message, 'controllers/suppliers/getSuppliersController/CtrGetSuppliers', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}