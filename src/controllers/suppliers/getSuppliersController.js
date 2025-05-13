import { HandleError } from '../../utils/HandleError.js'
import { GetSuppliers, GetSuppliersByFilter } from '../../querys/suppliers/getSuppliers.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los proveedores que hay en el sistema
export const CtrGetSuppliers = async (req, res) => {
    try {
        //obtenemos la palabra a buscar, sino existe se le asigna una cadena vacía
        const search = req.query.search;
        // Obtiene el número de página (si no hay búsqueda, mantiene la paginación actual)
        const page = search ? 1 : parseInt(req.query.page) || 1;

        let suppliers = null

        //Valida si ha ingresado una palabra a buscar
        if (search) {
            //obtiene los proveedores filtrados
            suppliers = await GetSuppliersByFilter(page, search);
        } else {
            //obtiene toda la data de los proveedores
            suppliers = await GetSuppliers(page);
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