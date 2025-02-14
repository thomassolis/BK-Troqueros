import Joi from "joi";



//Convierte la fecha en formato (YYYY-MM-DD)
export const DateConverter = (date) => {
    try {
        // Separar la fecha y la hora
        const fecha = date.split(" ");

        // Separar día, mes y año
        const [dia, mes, anio] = fecha.split(":").map(Number);

        // Retornar solo la fecha en formato SQL Server (YYYY-MM-DD)
        return `${anio}-${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
        
    } catch (error) {
        throw new Error('Error al convertir la fecha al formato (YYYY-MM-DD) de SQL');
    }    
}

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

const schema = Joi.object({
    //fecha: Joi.date().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fecha1: Joi.date().required
});