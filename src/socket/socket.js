import { Server } from 'socket.io';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { typeError } from '../dictionary/typeError.js';
import { HandleError } from '../utils/HandleError.js';

let io;

// Inicia el socket
export const InitSocket = (server) => {
    try {
        io = new Server(server) // Instaciamos un nuevo objeto

        io.on('connection', (socket) => {
            console.log('Usuario conectado', socket.id)

            // Evento que escucha cuando se crean nuevas solicitudes de creación de shipper o consignee
            socket.on('Nueva_Solicitud', (data) => {
                console.log('Procesando Solicitud...', data)
                // Evento que emite una nueva notificación al departamento de IT
                socket.broadcast.emit('Solicitud_confirmada', {
                    title: 'Creación de Customer.',
                    message: data.message
                })
            })

            // Evento que escucha cuando el usuario se desconecta
            socket.on('disconnect', () => {
                console.log('Usuario desconectado');
            });
        })
    } catch (error) {
        const code = GenerateCodeError('ESK', typeError.general);
        HandleError(code, error.message, 'socket/socket/InitSocket', error)
        throw new Error('Ha ocurrido un error al establecer el socket.');
    }
}


// Obtiene la configuración del socket
export const GetSocket = () => {
    try {
        // Valida que el socket se haya inicializado
        if (!io) {
            throw new Error('Socket no inicializado.');            
        }

        return io;
    } catch (error) {
        const code = GenerateCodeError('ESK', typeError.general);
        HandleError(code, error.message, 'socket/socket/GetSocket', error)
        throw new Error('Ha ocurrido un error al obtener el socket.');
    }
}