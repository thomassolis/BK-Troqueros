import { HandleError } from "../utils/HandleError.js"

export const ValidatePermissionMiddleware = (req, res, next) => {
    try {
        console.log(req.session.user.ver_registros);
        console.log(req.method);

        if (req.method == 'GET'){
            PermissionToSee(req.session.user.ver_registros, res);
        }

        if (req.method == 'POST'){
            PermissionToCreate(req.session.user.crear_registros, res);
        }

        if (req.method == 'PATCH'){
            PermissionToEdit(req.session.user.editar_modulos, res);
        }

        if (req.method == 'DELETE'){
            PermissionToDelete(req.session.user.eliminar_modulos, res);
        }

        if (req.method == 'PUT'){
            PermissionToUpdate(req.session.user.actualizar_registros, res);
        }

        next();
    } catch (error) {
        console.log(error);
        HandleError(error.message, 'ValidatePermissionMiddleware', error, 'user');
    }
}

const PermissionToSee = (permission, res) => {
    if (!permission) {
        return res.json({ success: false, message: 'No tienes permiso para ver.' });
    }

    return res.json({ success: true, message: '' });
}

const PermissionToEdit = (permission, res) => {
    if (!permission) {
        return res.json({ success: false, message: 'No tienes permiso de edicción.' });
    }

    return res.json({ success: true, message: '' });
}

const PermissionToDelete = (permission, res) => {
    if (!permission) {
        return res.json({ success: false, message: 'No tienes permiso para eliminar.' });
    }

    return res.json({ success: true, message: '' });
}

const PermissionToCreate = (permission, res) => {
    if (!permission) {
        return res.json({ success: false, message: 'No tienes permiso para crear.' });
    }

    return res.json({ success: true, message: '' });
}

const PermissionToUpdate = (permission, res) => {
    if (!permission) {
        return res.json({ success: false, message: 'No tienes permiso para actualizar.' });
    }

    return res.json({ success: true, message: '' });
}