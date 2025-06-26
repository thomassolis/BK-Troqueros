import { GenerateCodeError } from '../utils/getCodeError.js';
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

//Convierte la fecha en formato (YYYY-MM-DD HH:mm:ss)
export const DateTimeConverter = (date) => {
    try {
        // Separar la fecha y la hora
        const [fecha, hora] = date.split(" ");
        
        // Separar día, mes y año
        const [dia, mes, anio] = fecha.split(":").map(Number);
        
        // Devolver el formato compatible con SQL Server
        return `${anio}-${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")} ${hora}`;
    } catch (error) {
        throw new Error('Error al convertir la fecha al formato (YYYY-MM-DD HH:mm:ss) de SQL');
    }    
}

// Obtiene la hora de la petición en Objeto Date
export const GetTime = (time) => {
    // Separa la hora en: horas, minutos y segundos
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Crear un objeto Date con solo la parte de la hora
    const horaDate = new Date();
    horaDate.setUTCHours(hours, minutes, seconds, 0);

    return horaDate;
}