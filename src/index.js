import app from './App.js';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';

// Cargar variables de entorno
dotenv.config();

// Configurar el puerto
const PORT = process.env.PORT || 5000;

// Leer los certificados SSL
const sslOptions = {
  key: fs.readFileSync('./ssl/localhost.key'),
  cert: fs.readFileSync('./ssl/localhost.crt'),
};

// Iniciar servidor HTTPS
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 Secure Server running on https://localhost:${PORT}`);
});
