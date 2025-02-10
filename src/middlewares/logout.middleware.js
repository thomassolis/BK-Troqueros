import { HandleError } from "../utils/HandleError.js";

export const CleanToken = (req, res) => {
    try {
        
        res.clearCookie('token', '', { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict' 
        });

        res.json({ success: true, message: 'Logout exitoso' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
        HandleError(error.message, 'logout.middleware', error, 'user')
        res.json({ success: false, message: "Ha ocurrido un error inesperado al cerrar sesión" });
    }
};