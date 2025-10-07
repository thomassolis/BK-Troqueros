import { VerifyPermission } from '../querys/VerifyPermission.js';
import { HandleError } from '../utils/HandleError.js';
import { GetSessionUserInfo } from '../contexts/sessionContext.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

//controlador para verificar los permisos del usuario
export const VerifyPermissionMiddleware = (module) => {        
    return async (req, res, next) => {
        try {
            const rol = GetSessionUserInfo().rol; //obtenemos el rol del usuario
            const action = GetAction(req.method); // Obtenemos la acción que quiere hacer el usuario
            // Valida la acción
            if (!action) {
                return res.status(403).json({success: false, message: 'Acción requerida!'});
            }

            //comprueba que tenga los permisos
            const hasPermission = await VerifyPermission(module, action, rol);

            //valida si tiene los permisos para dicha acción
            if (!hasPermission) {
                return res.status(403).json({success: false, message: 'No tienes permiso para esta acción.'});
            }
            next();
        } catch (error) {
            const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
            const code = GenerateCodeError(modules[module], typeError.permisoDenegado);
            HandleError(code, error.message, 'middlewares/VerifyPermission.middleware/VerifyPermissionMiddleware', error);
            return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde`});
        }
    }
    
}


// Obtiene la acción que esta haciendo el usuario
const GetAction = (action) => {
    switch (action) {
        case 'GET':            
            return 'ver_registros';
        case 'POST':            
            return 'crear_registros';
        case 'PUT':            
            return 'actualizar_registros';
        case 'PATCH':
            return 'actualizar_registros';
        case 'DELETE':            
            return 'eliminar_registros';    
        default:
            return null;
    }
}