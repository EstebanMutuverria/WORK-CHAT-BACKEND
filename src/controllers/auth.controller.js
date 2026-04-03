/**
 * @fileoverview Controlador principal de Autenticación.
 * Recibe las peticiones HTTP (request), ejecuta los servicios de lógica de negocio o validación intermedios, 
 * y retorna la respuesta HTTP (response) al cliente.
 */

import authService from "../service/auth.service.js"
import { getStatusPage, getResetPasswordPage } from "../helper/htmlTemplates.helper.js"
import ENVIRONMENT from "../config/environment.config.js"

/**
 * @class AuthController
 * @description Clase que contiene los manejadores de ruta (handlers) para flujos de registro, login y reseteo de configuración.
 */
class AuthController {
    /**
     * @async
     * @function userRegistration
     * @description Recibe los datos de registro (body), invoca al servicio y envía la respuesta HTTP.
     * @param {Object} request - Objeto Request de Express. Contiene los campos del formulario en body.
     * @param {Object} response - Objeto Response de Express.
     * @returns {Promise<Object>} Promesa que se resuelve tras el envío del JSON al cliente.
     */
    async userRegistration(request, response, next) {
        try {
            const { user_name, password, email } = request.body

            await authService.register({ user_name, password, email })

            return response.status(201).json({
                message: "Usuario creado correctamente",
                ok: true,
                status: 201
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @async
     * @function login
     * @description Controla el proceso de inicio de sesión tomando el body, invocando el servicio, devolviendo el JWT resultante en el payload.
     * @param {Object} req - Objeto Request de Express.
     * @param {Object} res - Objeto Response de Express.
     * @returns {Promise<Object>} Promesa tras el envío del JSON final.
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body

            const auth_token = await authService.login({ email, password })

            return res.status(200).json({
                message: "Usuario logueado correctamente",
                ok: true,
                status: 200,
                ok: true,
                data: {
                    auth_token: auth_token
                }
            })

        } catch (error) {
            next(error)
        }
    }

    /**
     * @async
     * @function verify_email
     * @description Endpoint que actúa para confirmar un email por un token en query string `?verify_email_token=...`.
     * Retorna una respuesta tipo HTML una vez verificada.
     * @param {Object} request - Objeto Request de Express, donde entra el token.
     * @param {Object} response - Objeto Response de Express.
     * @returns {Promise<Object>}
     */
    async verify_email(request, response, next) {
        try {
            const { verify_email_token } = request.query

            await authService.verify_email(verify_email_token)

            return response.status(200).send(getStatusPage(
                true,
                '¡Email Verificado!',
                'Tu cuenta ha sido confirmada con éxito. Ya puedes empezar a usar WorkChat.',
                'Ir a la aplicación',
                `${ENVIRONMENT.URL_FRONTEND_DEPLOYED}/login`
            ))
        } catch (error) {
            return response.status(error.status || 500).send(getStatusPage(
                false,
                'Error de Verificación',
                error.message || 'No se pudo verificar el correo electrónico.',
                'Volver al inicio',
                `${ENVIRONMENT.URL_FRONTEND_DEPLOYED}/login`
            ))
        }
    }

    /**
     * @async
     * @function resetPasswordRequest
     * @description Dispara la acción de servicio para generar un restablecimiento de contraseña. El email entra por body.
     * @param {Object} request - Request.
     * @param {Object} response - Response.
     * @returns {Promise<Object>}
     */
    async resetPasswordRequest(request, response, next) {
        try {
            const { email } = request.body

            console.log('1. PIDIENDO RESET DE CONTRASEÑA DE: ', request.body)

            await authService.resetPasswordRequest({ email })
            return response.status(200).json(
                {
                    message: "Se ha enviado un mail para restablecer la contraseña",
                    ok: true,
                    status: 200
                }
            )
        } catch (error) {
            next(error)
        }
    }

    /**
     * @async
     * @function renderResetPassword
     * @description Renderiza la página para restablecer la contraseña.
     * @param {Object} request - Request con reset_token en params.
     * @param {Object} response - Response.
     */
    async renderResetPassword(request, response) {
        const { reset_token } = request.params
        return response.status(200).send(getResetPasswordPage(reset_token))
    }

    /**
     * @async
     * @function resetPassword
     * @description Recibe la nueva contraseña y el token para aplicarlo.
     * @param {Object} request - Request.
     * @param {Object} response - Response.
     */
    async resetPassword(request, response) {
        const { reset_token } = request.params
        try {
            console.log('2. TOKEN RECIBIDO POR PARAMS: ', reset_token)
            console.log('3. BODY RECIBIDO: ', request.body)
            const { password } = request.body
            await authService.resetPassword({ password, reset_token })

            return response.status(200).send(getStatusPage(
                true,
                'Contraseña Actualizada',
                'Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.',
                'Iniciar Sesión',
                `${ENVIRONMENT.URL_FRONTEND_DEPLOYED}/login`
            ))
        } catch (error) {
            console.error('ERROR AL INTENTAR RESTABLECER LA CONTRASEÑA: ', error)
            return response.status(error.status || 500).send(getResetPasswordPage(
                reset_token,
                error.message || 'Error al restablecer la contraseña'
            ))
        }
    }
}

/**
 * @constant {AuthController} authController
 * @description Instancia del controlador de autenticación exportada para ser usada en las rutas.
 */
const authController = new AuthController()
export default authController