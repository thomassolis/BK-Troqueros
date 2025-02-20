import { v1 } from 'uuid';
import { VerifyPermission } from '../querys/VerifyPermission.js';
import { HandleError } from '../utils/HandleError.js';

//controlador para verificar los permisos del usuario
export const VerifyPermissionMiddleware = async (req, res, next) => {
    try {
        const rol = req.session.user.rol;
        const module = req.permission.module;
        const action = req.permission.action;

        //valida que tanto el rol, module y action no sean undefined
        if (!rol || !module || !action) {
            return res.status(404).json({success: false, message: 'UPS... Ha ocurrido un error, inténtelo más tarde'});
        }

        //comprueba que tenga los permisos
        const hasPermission = await VerifyPermission(module, action, rol);

        //valida si tiene los permisos para dicha acción
        if (!hasPermission) {
            return res.status(403).json({success: false, message: 'No tienes permiso para esta acción'});
        }

        next();
    } catch (error) {
        HandleError(v1, error.message, 'controllers/VerifyPermissionController/CtrVerifyPermission', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}