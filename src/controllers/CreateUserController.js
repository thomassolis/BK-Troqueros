import bcrypt from 'bcryptjs';
import { CreateUser, ValidateEmail } from "../querys/CreateUser/RegisterUser.js";
import { HandleError } from "../utils/HandleError.js";
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

export const CtrCreateUser = async (req, res) => {
    try {
        const dataUser = req.body;

        if (!dataUser) {
            res.json({ success: false, message: 'Debe introducir la información solicitada.' })
        }

        const emailExist = await ValidateEmail(dataUser.email);

        if (emailExist) {
            return res.json({ success: false, message: 'El correo ya existe, por favor intente con otro correo.' });
        }

        const passHash = await GeneratePasswordHash(dataUser.pass)

        if (!passHash){
            return res.json({ success: false, message: 'Error al crear la cuenta, intentelo más tarde.' });
        }

        dataUser.pass = passHash;

        const userCreated = await CreateUser(dataUser);

        if (!userCreated) {
            return res.json({ success: false, message: 'Error al crear al usuario. Por favor, inténtelo más tarde.' });
        }

        return res.json({ success: true, message: 'Usuario creado satisfactoriamente 😃' });

    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoCreado);
        HandleError(code, error.message, 'CtrCreateUser', error);
        return res.json({ success: false, message: 'Error al crear el usuario' });
    }
}

const GeneratePasswordHash = async (pass) => {
    const saltRounds = 10; // Número de rondas de sal para hacer más seguro el hash

    try {
        const hash = await bcrypt.hash(pass, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error al generar el hash de la contraseña');
    }
};