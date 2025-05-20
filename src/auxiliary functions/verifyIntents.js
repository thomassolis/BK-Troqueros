import dotenv from 'dotenv';
import { UpdateIntents } from '../querys/Login/updateIntents.js';

dotenv.config();

//Valida el numero de intentos por parte del usuario
export const NumeroMaxIntentos = async (email, numIntentos, user_ban) => {
    const MAX_INTENTOS = 5;

    //Verifica que el usuario sea de la tabla de baneos
    if (numIntentos < MAX_INTENTOS && user_ban) {
        await UpdateIntents(email, numIntentos + 1, 'Usuarios_Baneados'); //actualiza el numero de intentos por parte del usuario

        return {
            success: true,
            msg: `Credenciales incorrectas. Te quedan ${MAX_INTENTOS - (numIntentos + 1)} intentos`,
        }
    }

    //Sí los intentos es menor a 5, actualiza el numero de intentos por parte de usuario
    if (numIntentos < MAX_INTENTOS && !user_ban) {
        await UpdateIntents(email, numIntentos + 1, 'Usuarios'); //actualiza el numero de intentos por parte del usuario

        return {
            success: true,
            msg: `Credenciales incorrectas. Te quedan ${MAX_INTENTOS - (numIntentos + 1)} intentos`,
        }
    }

    return {
        userB: user_ban? user_ban: false,
        msg: 'Has alcanzado el número máximo de intentos. Tu cuenta ha sido baneada. Por favor espere 10 minutos.',
    }
}