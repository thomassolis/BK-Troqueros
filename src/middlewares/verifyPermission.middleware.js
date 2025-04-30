import { VerifyPermission } from '../querys/VerifyPermission.js';
import { HandleError } from '../utils/HandleError.js';
import { GetSessionUserInfo } from '../contexts/sessionContext.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

//controlador para verificar los permisos del usuario
export const VerifyPermissionMiddleware = async (req, res, next) => {
    try {
        const rol = GetSessionUserInfo().rol; //obtenemos el rol del usuario
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
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError.permisoDenegado);
        HandleError(code, error.message, 'controllers/VerifyPermissionController/CtrVerifyPermission', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor--'});
    }
}