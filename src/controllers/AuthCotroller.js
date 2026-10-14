import { codificarToken } from '../JWT/code.js';
import { ValidateUser, VerifyPassword } from '../querys/Login/login.js';
import { HandleError } from '../utils/HandleError.js';
import { TimeRemaining } from '../querys/Login/timeRemaining.js';
import { InsertUserBan } from '../querys/Login/insertUserBan.js';
import { NumeroMaxIntentos } from '../auxiliary functions/verifyIntents.js';
import { Banned, UnBan } from '../querys/Login/banned.js';
import { UpdateIntents } from '../querys/Login/updateIntents.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

export const ctrAuthentication = async (req, res) => {
    try {
        const { email, pass } = req.body;
        //Verifica que las credenciales del usuario
        if (!email || !pass) {
            return res.status(400).json({ success: false, message: 'Los campos están vacíos.' });
        }

        //Obtiene los datos del usuario
        console.log('email', email);
        console.log('pass', pass);
        const user = await ValidateUser(email);
        console.log('user', user);
        //Valida que el usuario exista
        if (!user) {
            console.log('test')
            await InsertUserBan(email); //Sino existe, lo crea y lo guarda en la tabla de usuarios baneados
            return res.status(404).json({ success: false, message: 'Credenciales incorrectas. Te quedan 4 intentos--' });
        }

        //verifica que el usuario no este baneado y a su vez que este no sea de la tabla de usuarios baneados
        if (user.suspendido === '1' && user.user_ban) {
            return res.status(403).json({ success: false, message: 'Tu cuenta ha sido suspendida. Contáctese con servicio técnico' });
        }

        //verifica si el usuario ha sido baneado y que sea de la tabla usuarios
        if (user.suspendido === '1' && !user.user_ban) {
            const time = await TimeRemaining(user.id_usuario); //Obtiene el tiempo restante del ban

            //valida que el tiempo sea mayor de 0 y le muestra cuanto tiempo le hace falta
            if (time > 0) {
                return res.status(403).json({ success: false, message: `Has sido baneado. Tiempo restante ${time}` });
            }

            await UnBan(user.email); // De lo contrario desbanea al usuario
            return res.status(200).json({ success: false, message: 'Tienes 5 intentos' });
        }

        //Valida que la contraseña sea correcta
        const dataUser = await VerifyPassword(pass, user);
        //Sino es correcta si le indica el numero de intentos que le queda
        console.log('dataUser', dataUser);
        if (!dataUser) {
            const ban = await NumeroMaxIntentos(user.email, parseInt(user.max_intento), parseInt(user.user_ban))

            //Valida el número de intentos por parte del usuario
            if (ban.success) {
                return res.status(403).json({ success: false, message: ban.msg });
            }

            if (Boolean(ban.userB)) {
                await Banned(email, 'Usuarios_Baneados');
                return res.status(403).json({ success: false, message: 'Has alcanzado el número máximo de intentos. Tu cuenta ha sido baneada.' });
            }

            await Banned(email, 'Usuarios');
            return res.status(403).json({ success: false, message: ban.msg });
        }

        // Codificando el token
        console.log('dataUser', dataUser);
        const token = codificarToken(dataUser);
        console.log('token', token);
        if (!token) {
            return res.status(400).json({ success: false, message: 'Error al generar el token.' });
        }

        // Enviar el token en las cookies
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('Troquero-Token', token, {
            httpOnly: true,                                    // La cookie no puede ser accedida por JavaScript
            secure: isProduction,                              // Solo HTTPS en producción; HTTP permitido en desarrollo
            sameSite: isProduction ? 'Strict' : 'Lax',        // Lax en dev para permitir mismo dominio con distinto puerto
            maxAge: 32400000                                   // La cookie expirará en 9 horas
        });

        //Actualiza el numero de intentos
        await UpdateIntents(dataUser.email);

        return res.status(200).json({ success: true, message: 'Login exitoso', data: dataUser });
    } catch (error) {
        console.error(error);
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoAutenticado); //generar codigo del error
        HandleError(code, error.message, 'controller/AuthController/ctrAuthentication', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
