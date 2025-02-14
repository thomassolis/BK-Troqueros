import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';


export const CtrLogout = (req, res) => {
    try {
        res.clearCookie('token', '', { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict' 
        });
        
        res.status(200).json({ success: true, message: 'Logout exitoso' });
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/LogoutController/CtrLogout', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'})
    }
} 