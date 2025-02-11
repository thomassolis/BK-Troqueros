import { v1 } from 'uuid';
import { VerifyPermission } from '../querys/VerifyPermission.js';
import { HandleError } from '../utils/HandleError.js';

export const CtrVerifyPermission = async (req, res) => {
    try {
        const rol = req.session.user.rol;
        const module = req.permission.module;
        const action = req.permission.action;

        if (!rol && !module && !action) {
            return res.status(404).json({success: false, message: ''});
        }

        const hasPermission = await VerifyPermission(module, action, rol);

        if (!hasPermission) {
            return res.status(403).json({success: false, message: 'No tienes permiso para esta acción'});
        }

        return res.status(200).json({success: false, message: 'Permiso concebido'});
    } catch (error) {
        HandleError(v1, error.message, 'controllers/VerifyPermissionController/CtrVerifyPermission', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}