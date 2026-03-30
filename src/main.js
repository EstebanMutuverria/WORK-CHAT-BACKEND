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
import memberWorkspaceRepository from "./repository/memberWorkspace.repository.js";
import workspaceRepository from "./repository/workspace.repository.js";


// Inicializa la conexión con MongoDB
connectMongoDB();

// Inicializa la aplicación de Express
const app = express()

//CORS Permite que el frontend se comunique con el backend sin que el navegador bloquee esa conexion.
app.use(cors({
    origin: '*'
}));

// Middleware para procesar cuerpos de solicitudes en formato JSON
app.use(express.json())

// Configuración y montaje de las rutas
/**
 * @description Montaje de la ruta para chequeos de salud (Health Check).
 */
app.use('/api/health', healthRouter)

/**
 * @description Montaje de la ruta relacionada a autenticación, registro, y recuperación de contraseñas.
 */
app.use('/api/auth', authRouter)

/**
 * @description Montaje de la ruta relacionada a Listado de workspaces del usuario logueado.
 */
app.use('/api/workspaces', memberWorkspacesRouter)

/**
 * @description Inicia el servidor de Express a escuchar peticiones en el puerto configurado en el entorno.
 */
app.listen(ENVIRONMENT.PORT,
    () => console.log('El servidor esta corriendo en el puerto: ' + ENVIRONMENT.PORT)
)

/* workspaceRepository.create('test', 'lorem', 'lorem') */
/* memberWorkspaceRepository.create('69c857d6f2b3e9c2a79a9701', '69c575edb55476903eb48ced', 'owner') */