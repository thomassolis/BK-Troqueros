import { v1 } from 'uuid'
import { HandleError } from '../../utils/HandleError.js'
import { GetTruckHead, GetTruckHeadByFilter } from '../../querys/TruckHead/getTruckHead.js';

//Obtiene todos los cabezales que hay en el sistema
export const CtrGetTruckHead = async (req, res) => {
    try {
        //obtenemos el numero de pagina, sino existe se le asigna 1
        const page = parseInt(req.query.page) || 1;

        //obtenemos la palabra a buscar
        const search = req.query.search;

        //Valida si ha ingresado una palabra a buscar
        if (search) {
            //obtiene los cabezales filtrados
            const truckHead = (await GetTruckHeadByFilter(1, search)).flat();

            //valida que los truckHead no sea nulo
            if (truckHead.length === 0) {
                return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
            }

            return res.status(200).json({success: true, message: 'Data enviada', data: chassis});
        }

        //obtiene toda la data del cabezal y reduce el anidamiento
        const truckHead = (await GetTruckHead(page)).flat();

        //valida que truckHead no sea nulo
        if (truckHead.length === 0) {
            return res.status(200).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: truckHead});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/getTruckHeadController/CtrGetTruckHead', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}