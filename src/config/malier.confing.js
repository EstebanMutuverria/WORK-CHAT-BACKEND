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
    host: "smtp.googlemail.com",
    port: 465,
    secure: true,
    auth: {
        user: ENVIRONMENT.MAIL_USER,
        pass: ENVIRONMENT.MAIL_PASSWORD,
    },
    // Forzamos IPv4 para evitar errores de red en Render
    family: 4, 
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
});

export default mailerTransporter