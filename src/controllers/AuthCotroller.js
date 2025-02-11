import { v1 } from 'uuid';
import { codificarToken } from '../JWT/code.js';
import { ValidateUser } from '../querys/Login/login.js';
import { HandleError } from '../utils/HandleError.js';

export const ctrAuthentication = async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            return res.status(400).json({ success: false, message: 'Los campos están vacíos.' });
        }

        const dataUser = await ValidateUser(email, pass);
        
        if (!dataUser) {
            return res.status(400).json({ success: false, message: 'Credenciales incorrectas' });
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
            maxAge: 3600000        // La cookie expirará en 1 hora
        });

        return res.status(200).json({ success: true, message: 'Login exitoso' });
    } catch (error) {
        HandleError(v1, error.message, 'controller/AuthController/ctrAuthentication', error, 'user');
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
