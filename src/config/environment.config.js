/**
 * @fileoverview Configuración de variables de entorno de la aplicación.
 * Centraliza el acceso a las variables definidas en el archivo .env.
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * @constant {Object} ENVIRONMENT
 * @description Objeto que contiene las variables de entorno principales utilizadas en el proyecto.
 */
const ENVIRONMENT = {
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    PORT: process.env.PORT || 8080,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    URL_BACKEND: process.env.URL_BACKEND,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    URL_FRONTEND: process.env.URL_FRONTEND,
    URL_FRONTEND_DEPLOYED: process.env.URL_FRONTEND_DEPLOYED,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    
    /**
     * @description Obtiene la URL del frontend adecuada según el entorno actual.
     * @returns {string} URL absoluta del frontend.
     */
    get FRONTEND_URL() {
        const isProduction = process.env.NODE_ENV === 'production';
        const url = isProduction 
            ? (this.URL_FRONTEND_DEPLOYED || this.URL_FRONTEND) 
            : (this.URL_FRONTEND || this.URL_FRONTEND_DEPLOYED);
        
        // Fallback de seguridad para evitar que sea undefined
        return url || 'http://localhost:5173';
    }
}

export default ENVIRONMENT
