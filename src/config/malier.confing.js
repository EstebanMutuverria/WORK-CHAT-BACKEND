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
    service: "gmail",
    auth: {
        user: ENVIRONMENT.MAIL_USER,
        pass: ENVIRONMENT.MAIL_PASSWORD,
    },
});

export default mailerTransporter