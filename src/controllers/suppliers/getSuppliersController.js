import { v1 } from 'uuid'
import { HandleError } from '../../utils/HandleError.js'
import { GetSuppliers, GetSuppliersByFilter } from '../../querys/suppliers/getSuppliers.js';

//Obtiene todos los proveedores que hay en el sistema
export const CtrGetSuppliers = async (req, res) => {
    try {
        //obtenemos el numero de pagina, sino existe se le asigna 1
        const page = parseInt(req.query.page) || 1;

        //obtenemos la palabra a buscar
        const search = req.query.search;

        //Valida si ha ingresado una palabra a buscar
        if (search) {
            //obtiene los proveedores filtrados
            const suppliers = (await GetSuppliersByFilter(1, search)).flat();

            //valida que los proveedores no sea nulo
            if (suppliers.length === 0) {
                return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
            }

            return res.status(200).json({success: true, message: 'Data enviada', data: suppliers});
        }

        //obtiene toda la data de los proveedores y reduce el anidamiento
        const suppliers = (await GetSuppliers(page)).flat();

        //valida que no sea nulo
        if (suppliers.length === 0) {
            return res.status(404).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: suppliers});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/suppliers/getSuppliersController/CtrGetSuppliers', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}