import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

export const CtrLogout = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('Troquero-Token', { 
            httpOnly: true, 
            secure: isProduction, 
            sameSite: isProduction ? 'None' : 'Lax'
        });
        
        res.status(200).json({ success: true, message: 'Logout exitoso' });
    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.LOGOUT);
        HandleError(code, error.message, 'controllers/LogoutController/CtrLogout', error);
        return res.status(500).json({success: false, message: 'Error al cerrar sessión'});
    }
} 