/**
 * @fileoverview Configuración del servicio de envío de correos electrónicos.
 * Utiliza la API HTTP de Resend para enviar correos, evitando las restricciones
 * de puertos SMTP en entornos de hosting como Render.
 */

import { Resend } from 'resend';
import ENVIRONMENT from "./environment.config.js";

/**
 * @constant {Resend} resendClient
 * @description Instancia del cliente de Resend configurada con la API Key del entorno.
 */
const resendClient = new Resend(ENVIRONMENT.RESEND_API_KEY);

export default resendClient;