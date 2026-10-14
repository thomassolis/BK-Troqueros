import app from './App.js';
import dotenv from 'dotenv';
import { InitSocket } from './socket/socket.js';
import { ConnectDB } from './db/db.js';
import http from 'http';

dotenv.config();
ConnectDB();

const PORT = process.env.PORT || 5001;

// Crear servidor HTTP (no HTTPS)
const server = http.createServer(app);

// Inicializar socket
InitSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
