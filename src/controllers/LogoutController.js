import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';


export const CtrLogout = (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Logout exitoso' });
    } catch (error) {
        HandleError(v1, error.message, 'controllers/LogoutController/CtrLogout', error, 'user');
        res.status(500).json({success: false, message: 'Error interno del servidor'})
    }
} 