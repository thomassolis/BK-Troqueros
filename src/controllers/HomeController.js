import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';

export const CtrHome = (req, res) => {
    try {
        return res.status(200).json({ success: true, message: `Bienvenido ${req.session.user.nombre} ${req.session.user.apellido}`});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/HomeController/CtrHome', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}