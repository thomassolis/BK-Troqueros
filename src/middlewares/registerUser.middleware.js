import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { userSchema } from '../schema/schemaUsers.js';


export const ValidateUserData = (req, res, next) => {
    try {
        const data = req.body; // Obtenemos la info del usuario

        // Valida que data no sea undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = userSchema.validate(data); // Valida que los datos cumplan con el schema

        if (error) {
            return res.json({ success: false, message: error.message });
        }

        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.USUARIOS, typeError.usuarioNoCreado);
        HandleError(code, error.message, 'middleware/RegisterUser.middleware/ValidateUserData', error);
        return res.status(500).json({success: false, message: `Error al validar los datos del usuario ${req.body.nombre} ${req.body.apellido}`});
    }    
}

