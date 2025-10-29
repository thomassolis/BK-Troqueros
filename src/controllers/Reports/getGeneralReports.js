import { getReports } from "../../querys/Reports/getReports.js";

export const getGeneralReports = async (req, res) => {    
    const filters = req.query;    
    try{
        const reports = await getReports(filters);        

        if(!reports){
            return res.status(500).json({success:false, message:'No se encontraron reportes disponibles'})
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: reports});
    }catch(error){
        console.error('Error en getGeneralReports: ', error);
    }
}