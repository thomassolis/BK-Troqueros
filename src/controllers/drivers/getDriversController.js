import { modules } from '../../dictionary/modules.js'
import { typeError } from '../../dictionary/typeError.js'
import { GetAllDrivers, GetDriversByFilter } from '../../querys/drivers/getDrivers.js'
import { GenerateCodeError } from '../../utils/getCodeError.js'
import { HandleError } from '../../utils/HandleError.js'



export const Ctr_GetDrivers = async (req, res) => {
    try {
        //obtenemos la palabra a buscar
        const search = req.query.search;
        // Obtiene el número de página (si no hay búsqueda, mantiene la paginación actual)
        const page = search ? 1 : parseInt(req.query.page) || 1;

        let drivers = null

        if (search) {
            drivers = await GetDriversByFilter(page, search)
        } else {
            drivers = await GetAllDrivers(page)
        }

        if (!drivers) {
            return res.status(404).json({ success: false, message: "No se ha podido obtener los proveedores. Intente más tarde" })
        }

        return res.status(200).json({ success: true, message: "Data Enviada", data: drivers })
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.GET)
        HandleError(code, error.message, 'controllers/drivers/getDriversController/Ctr_GetDrivers', error)
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}