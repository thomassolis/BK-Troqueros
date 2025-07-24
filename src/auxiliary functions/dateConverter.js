import Joi from 'joi';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { HandleError } from '../utils/HandleError.js';

//Convierte la fecha en formato (DD-MM-YYYY)
export const DateConverter = (date) => {
    try {
        // Validar si la fecha es (null, undefined, etc.)
        if (!date) {
            return null;
        }

        // Convertir a objeto Date si es necesario
        const fechaObj = new Date(date);

        // Verificar si la fecha es válida
        if (isNaN(fechaObj.getTime())) {
            throw new Error(`Fecha inválida, ${error.message}`);
        }

        // Obtener día, mes y año
        const dia = fechaObj.getDate(); // Los dias en JS van de 0 a 30
        const mes = fechaObj.getMonth() + 1; // Los meses en JS van de 0 a 11
        const anio = fechaObj.getFullYear();

        // Formatear en dd/mm/yyyy
        return `${dia.toString().padStart(2, "0")}/${mes.toString().padStart(2, "0")}/${anio}`;

    } catch (error) {
        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, error.message, 'auxiliary functions/dateConverter/DateConverter', error)
        throw new Error(`Error al convertir la fecha al formato (DD/MM/YYYY)`);
    }
};

//Convierte la fecha (YYYY-MM-DD HH:mm:ss) a (YYYY-MM-DD)
export const DateConverterSQL = (date) => {
    try {
        if (!date) {
            return null;
        }

        // Si es un objeto Date, conviértelo a string con formato YYYY-MM-DD
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Si es una cadena tipo ISO, extraer solo la parte de la fecha
        if (typeof date === 'string' && date.includes('T')) {
            return date.split('T')[0];
        }

        // Si ya está en formato YYYY-MM-DD, devuélvelo tal cual
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }

        return null;
    } catch (error) {
        throw new Error('Error al convertir la fecha al formato (YYYY-MM-DD) de SQL');
    }    
}

const schema = Joi.object({
    //fecha: Joi.date().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fecha1: Joi.date().required
});