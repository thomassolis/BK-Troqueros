import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetTruckVan, GetTruckVanByFilter } from '../../querys/TruckVan/getTruckVan.js';

//Obtiene todos los furgones que hay en el sistema
export const CtrGetTruckVan = async (req, res) => {
    try {
        //obtenemos el numero de pagina, sino existe se le asigna 1
        const page = parseInt(req.query.page) || 1;

        //obtenemos la palabra a buscar
        const search = req.query.search;

        //Valida si ha ingresado una palabra a buscar
        if (search) {
            //obtiene los cabezales filtrados
            const truckVan = (await GetTruckVanByFilter(1, search)).flat();

            //valida que los truckHead no sea nulo
            if (truckVan.length === 0) {
                return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
            }

            return res.status(200).json({success: true, message: 'Data enviada', data: truckVan});
        }

        //obtiene toda la data del furgones y reduce el anidamiento
        const truckVan = (await GetTruckVan(page)).flat();

        //valida que no sea nulo
        if (truckVan.length === 0) {
            return res.status(200).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: truckVan});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/getTruckVanController/CtrGetTruckVan', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}