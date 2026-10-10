import app from './App.js';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import { InitSocket } from './socket/socket.js';
import { ConnectDB } from './db/db.js';

// Cargar variables de entorno
dotenv.config();

// Probar conexión a la base de datos PostgreSQL / Neon
ConnectDB();

// Configurar el puerto
const PORT = process.env.PORT || 5001;

// Leer los certificados SSL
const sslOptions = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

const server = https.createServer(sslOptions, app)
// Inicializamos el socket
InitSocket(server);

// Iniciar servidor HTTPS;

server.listen(PORT, () => {
  console.log(`🚀 Secure Server running on https://localhost:${PORT}`);
});
