/**
 * @fileoverview Configuración del servicio de envío de correos electrónicos.
 * Utiliza nodemailer para crear un transportador configurado con las credenciales de entorno.
 */

import nodemailer from "nodemailer";
import ENVIRONMENT from "./environment.config.js";

/**
 * @constant {Object} mailerTransporter
 * @description Instancia de nodemailer configurada para enviar correos usando el servicio de Gmail.
 * Las credenciales de autenticación se obtienen del objeto ENVIRONMENT definido globalmente.
 */
const mailerTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true para 465, false para otros puertos (como 587)
    auth: {
        user: ENVIRONMENT.MAIL_USER,
        pass: ENVIRONMENT.MAIL_PASSWORD,
    },
    // Ajustes para evitar problemas de conexión y DNS en Render
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    }
});

export default mailerTransporter