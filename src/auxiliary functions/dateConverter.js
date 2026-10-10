import { GenerateCodeError } from '../utils/getCodeError.js';
import { typeError } from '../dictionary/typeError.js';
import { HandleError } from '../utils/HandleError.js';

//Convierte la fecha en formato (DD-MM-YYYY)
export const DateConverter = (date) => {
    try {
        if (!date) return null;

        const fechaObj = new Date(date);

        if (isNaN(fechaObj.getTime())) {
            throw new Error(`Fecha inválida: ${date}`);
        }

        // Obtener día, mes y año en UTC para evitar el cambio por zona horaria
        const dia = fechaObj.getUTCDate();
        const mes = fechaObj.getUTCMonth() + 1;
        const anio = fechaObj.getUTCFullYear();

        const fechaFormateada = `${dia.toString().padStart(2, "0")}/${mes.toString().padStart(2, "0")}/${anio}`;

        return fechaFormateada;

    } catch (error) {
        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, error.message, 'auxiliary functions/dateConverter/DateConverter', error);
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
            return date.toISOString().split('T')[0];
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

// Obtiene la hora de la petición en Objeto Date
export const GetTime = (time) => {
    // Si no se pasa hora, por defecto 09:00:00
    if (!time) {
        return "09:00:00";
    }

    // Si ya es un objeto Date
    if (time instanceof Date) {
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // Si viene como string tipo "HH:MM:SS" o "HH:MM"
    const parts = String(time).split(':').map(Number);
    const hours = String(parts[0] || 0).padStart(2, '0');
    const minutes = String(parts[1] || 0).padStart(2, '0');
    const seconds = String(parts[2] || 0).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};


// Valida que la fecha sea una fecha valida
// Valida que la fecha cumpla el formato (YYYY-MM-DD)
export const ValidateDate = (dateTime) => {
    // Validar el formato con regex
    const regex = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
    if (!regex.test(dateTime.fecha_salida)) {
        return { scs: false, msg: 'La fecha debe tener el formato YYYY-MM-DD.' };
    }

    // Convertir a objeto Date y validar si es una fecha válida
    const dateSalida = new Date(dateTime.fecha_salida); // Parsea la fecha a un Objeto Date
    const currentDate = new Date(); // Obtiene la fecha actual

    // Valida que la fecha de salida no sea menor a la fecha actual
    if (currentDate >= dateSalida) {
        return { scs: false, msg: 'La fecha de salida debe ser mayor a la fecha de actual.' };
    }

    return { scs: true };
}

// Convierte la hora a string
export const ParseTime = (time) => {
    if (!time) return null;
    if (typeof time === 'string') return time;
    if (time && typeof time.getUTCHours === 'function') {
        const horas = String(time.getUTCHours()).padStart(2, '0');
        const minutos = String(time.getUTCMinutes()).padStart(2, '0');
        const segundos = String(time.getUTCSeconds()).padStart(2, '0');

        return `${horas}:${minutos}:${segundos}`;
    }
    return String(time);
}