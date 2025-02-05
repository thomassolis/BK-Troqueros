import { codificarToken } from "../JWT/code.js";
import handleError from "../utils/HandleError.js";
const user ={
    id: 1,
    nombre: "Juan Pérez",
    edad: 30,
    correo: "juan.perez@example.com",
    pass: "123456",
    telefono: "+507 1234-5678"
};

export const ctr_authentication = async (req, res)=>{
    console.log(req.body)
    const {email, pass} = req.body;

    if (!email || !pass){
        console.log("estan vacias")
    }
    
    if (email == user.correo && pass == user.pass){
        console.log("Sesión Iniciada.");

        const payload = user;

        const token = codificarToken(payload);

        //Enviar el token por las cookies
        res.cookie('token', token, {
            httpOnly: true,        // La cookie no puede ser accedida por JavaScript
            secure: true,          // La cookie solo se enviará a través de HTTPS
            sameSite: 'Strict',    // La cookie solo se enviará para solicitudes del mismo dominio
            maxAge: 3600000        // La cookie expirará en 1 hora
        });

        return res.json({ success:true, message: 'Login exitoso, token almacenado en cookies'});

    } else {
        console.log("Sesión No Iniciada.");
        handleError(message, "ctr_authentication")
        return res.status(401).json({success:false, message: 'Correo o contraseña incorrectos' });
        //req.resultado = "El correo o la contraseña son incorrectos.";
    }
}