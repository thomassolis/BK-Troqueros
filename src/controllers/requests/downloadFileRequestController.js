import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestsExcel } from '../../querys/requests/getRequestsExcel.js';
import { CreateTableExcelRequest } from '../../utils/createFileExcel.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { GroupAndSumByService } from './GroupAndSumByService.js';

export const Ctr_DownloadFileRequest = async (req, res) => {
    try {
        const filters = req.query; // Obtiene los filtros        
        const requests = await GetRequestsExcel(filters) // Obtiene las peticiones del sistema        
        // Valida que las peticiones no sean undefined
        if (!requests || requests.length === 0) {
            return res.status(404).json({success: false, message: 'No se encontraron resultados.'});
        }
        const dataRequest = GroupAndSumByService(requests); // Llama a la función para agrupar y sumar
        const buffer = await CreateTableExcelRequest(dataRequest); // Crea la tabla con los datos de las peticiones filtrados        
        if (!buffer) {
            return res.status(400).json({success: false, message: 'Ha ocurrido un error al crear el archivo. Inténtelo más tarde.'});
        }

        const currentDate = new Date().toLocaleDateString('es-ES').toString(); // Obtiene la fecha actual
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reporte ${currentDate}.xlsx`);
        res.send(buffer);
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'controllers/requests/downloadFileRequestController/Ctr_DownloadFileRequest', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}