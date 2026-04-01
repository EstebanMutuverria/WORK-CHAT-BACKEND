/**
 * @fileoverview Configuración de variables de entorno de la aplicación.
 * Centraliza el acceso a las variables definidas en el archivo .env.
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * @constant {Object} ENVIRONMENT
 * @description Objeto que contiene las variables de entorno principales utilizadas en el proyecto.
 * @property {string|undefined} MONGO_DB_CONNECTION_STRING - URI de conexión a la base de datos MongoDB.
 * @property {string|undefined} PORT - Puerto en el que se ejecuta el servidor.
 * @property {string|undefined} MAIL_USER - Usuario del servicio de correo para envío de emails.
 * @property {string|undefined} MAIL_PASSWORD - Contraseña del servicio de correo.
 * @property {string|undefined} URL_BACKEND - URL base del backend.
 * @property {string|undefined} JWT_SECRET_KEY - Clave secreta para la firma de JSON Web Tokens.
 */
const ENVIRONMENT = {
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    PORT: process.env.PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    URL_BACKEND: process.env.URL_BACKEND,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    URL_FRONTEND: process.env.URL_FRONTEND,
    URL_FRONTEND_DEPLOYED: process.env.URL_FRONTEND_DEPLOYED
}

export default ENVIRONMENT
