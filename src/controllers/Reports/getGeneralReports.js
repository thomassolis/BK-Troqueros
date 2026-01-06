import { getReports } from "../../querys/Reports/getReports.js";
import { getReportsTeam } from "../../querys/Reports/getReports.js";


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

    export const getTeamReports = async (req, res) => {
        try{
            const { page, pageSize, searchTerm, driverSearch, statusSelected, dates } = req.query;
            console.log('page', page, 'pageSize: ', pageSize);
            console.log('searchTerm', searchTerm, 'driver:', driverSearch, 'status:', statusSelected);
            const response = await getReportsTeam(page, pageSize, searchTerm, driverSearch, statusSelected, dates);

            return res.status(200).json({success:true, message: 'data enviada', data: response});
        }catch(error){
            console.error('Error en getTeamReports: ', error);
        }
    }
