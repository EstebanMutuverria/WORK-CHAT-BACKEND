/**
 * @fileoverview Archivo principal y punto de entrada de la aplicación.
 * Desde aquí se inicializa la conexión a la base de datos, los middleware globales, y se montan las rutas de Express.
*/

import ENVIRONMENT from "./config/environment.config.js";
import { connectMongoDB } from "./config/mongoDB.config.js";
import express from 'express'
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import cors from 'cors'
import memberWorkspacesRouter from "./routes/memberWorkspaces.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import channelWorkspaceRouter from "./routes/channelsWorkspace.route.js";
import messagesChannelWorkspaceRouter from "./routes/messagesChannelWorkspace.route.js";
import workspacesRouter from "./routes/workspaces.route.js";
import userRouter from "./routes/user.route.js";
import http from 'http';
import { Server } from 'socket.io';

// Inicializa la conexión con MongoDB y luego inicia el servidor
const startServer = async () => {
    try {
        await connectMongoDB();

        // Inicializa la aplicación de Express
        const app = express();
        const server = http.createServer(app);

        // Inicializa Socket.io
        const io = new Server(server, {
            cors: {
                origin: [
                    ENVIRONMENT.URL_FRONTEND,
                    ENVIRONMENT.URL_FRONTEND_DEPLOYED,
                    ENVIRONMENT.URL_BACKEND
                ],
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket']
        });

        // Hacer que io sea accesible desde los controladores
        app.set('socketio', io);

        // Configuración de Socket.io
        io.on('connection', (socket) => {
            console.log('Nuevo usuario conectado:', socket.id);

            socket.on('join_channel', (channelId) => {
                socket.join(channelId);
                console.log(`Usuario ${socket.id} se unió al canal: ${channelId}`);
            });

            socket.on('disconnect', () => {
                console.log('Usuario desconectado:', socket.id);
            });
        });

        // CORS
        const allowedOrigins = [
            ENVIRONMENT.URL_FRONTEND,
            ENVIRONMENT.URL_FRONTEND_DEPLOYED,
            ENVIRONMENT.URL_BACKEND
        ];

        app.use(cors({
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    var msg = 'La política CORS para este sitio no permite acceso desde el origen especificado.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            }
        }));

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Rutas
        app.use('/api/health', healthRouter);
        app.use('/api/auth', authRouter);
        app.use('/api/workspaces', workspacesRouter);
        app.use('/api/workspaces/:workspace_id/channels', channelWorkspaceRouter);
        app.use('/api/workspaces/:workspace_id/channels/:channel_id', messagesChannelWorkspaceRouter);
        app.use('/api/workspaces/:workspace_id/members', memberWorkspacesRouter);
        app.use('/api/user', userRouter);

        // Manejo de errores
        app.use(errorHandler);

        server.listen(ENVIRONMENT.PORT, () => {
            console.log('El servidor está corriendo en el puerto: ' + ENVIRONMENT.PORT);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

startServer();
