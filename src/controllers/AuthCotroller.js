import { v1 } from 'uuid';
import { codificarToken } from '../JWT/code.js';
import { ValidateUser, VerifyPassword } from '../querys/Login/login.js';
import { HandleError } from '../utils/HandleError.js';
import { TimeRemaining } from '../querys/Login/timeRemaining.js';
import { InsertUserBan } from '../querys/Login/insertUserBan.js';
import { NumeroMaxIntentos } from '../auxiliary functions/verifyIntents.js';
import { Banned, UnBan } from '../querys/Login/banned.js';
import { UpdateIntents } from '../querys/Login/updateIntents.js';

export const ctrAuthentication = async (req, res) => {
    try {
        const { email, pass } = req.body;

        //Verifica que las credenciales del usuario
        if (!email || !pass) {
            return res.status(400).json({ success: false, message: 'Los campos están vacíos.' });
        }

        //Obtiene los datos del usuario
        const user = await ValidateUser(email);

        //Valida que el usuario exista
        if (!user) {
            await InsertUserBan(email); //Sino existe, lo crea y lo guarda en la tabla de usuarios baneados
            return res.status(404).json({success: false, message: 'Credenciales incorrectas. Te quedan 4 intentos'});
        }

        //verifica que el usuario no este baneado y a su vez que este no sea de la tabla de usuarios baneados
        if (user.suspendido === '1' && user.user_ban) {
            return res.status(403).json({success: false, message: 'Tu cuenta ha sido suspendida. Contáctese con servicio técnico'});
        }     

        //verifica si el usuario ha sido baneado y que sea de la tabla usuarios
        if (user.suspendido === '1' && !user.user_ban) {
            const time = await TimeRemaining(user.id_usuario); //Obtiene el tiempo restante del ban

            //valida que el tiempo sea mayor de 0 y le muestra cuanto tiempo le hace falta
            if (time > 0) {
                return res.status(403).json({success: false, message: `Has sido baneado. Tiempo restante ${time}`});
            }
            
            await UnBan(user.email); // De lo contrario desbanea al usuario
            return res.status(200).json({success: false, message: 'Tienes 5 intentos'});
        }

        //Valida que la contraseña sea correcta
        const dataUser = await VerifyPassword(pass, user);

        //Sino es correcta si le indica el numero de intentos que le queda
        if (!dataUser) {
            const ban = await NumeroMaxIntentos(user.email, parseInt(user.max_intento), parseInt(user.user_ban))
            
            //Valida el número de intentos por parte del usuario
            if (ban.success) {
                return res.status(403).json({success: false, message: ban.msg});
            }

            if (Boolean(ban.userB)) {
                await Banned(email, process.env.TB_UB);
                return res.status(403).json({success: false, message: 'Has alcanzado el número máximo de intentos. Tu cuenta ha sido bloqueada.' });
            }

            await Banned(email, process.env.TB_US);
            return res.status(403).json({success: false, message: ban.msg });
        }

        // Codificando el token
        const token = codificarToken(dataUser);

        if (!token){
            return res.status(400).json({ success: false, message: 'Error al generar el token.' });
        }

        // Enviar el token en las cookies
        res.cookie('token', token, {
            httpOnly: true,        // La cookie no puede ser accedida por JavaScript
            secure: true,          // La cookie solo se enviará a través de HTTPS
            sameSite: 'Strict',    // La cookie solo se enviará para solicitudes del mismo dominio
            maxAge: 36000000        // La cookie expirará en 10 hora
        });

        //Actualiza el numero de intentos
        await UpdateIntents(dataUser.email, 0, process.env.TB_US);

        return res.status(200).json({ success: true, message: 'Login exitoso', data: req.session.user});
    } catch (error) {
        HandleError(v1(), error.message, 'controller/AuthController/ctrAuthentication', error, 'user');
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
