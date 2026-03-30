/**
 * @fileoverview Controlador principal de Autenticación.
 * Recibe las peticiones HTTP (request), ejecuta los servicios de lógica de negocio o validación intermedios, 
 * y retorna la respuesta HTTP (response) al cliente.
 */

import { response } from "express"
import userRepository from "../repository/user.repository.js"
import ServerError from "../helper/serverError.helper.js"
import authService from "../service/auth.service.js"

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
    async userRegistration(request, response) {
        try {
            const { user_name, password, email } = request.body

            await authService.register({ user_name, password, email })

            return response.status(201).json({
                message: "Usuario creado correctamente",
                ok: true,
                status: 201
            })
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                return response.status(500).json({
                    message: "Error interno",
                    ok: false,
                    status: 500
                })
            }
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
    async login(req, res) {
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
            if (error instanceof ServerError) {
                return res.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                return res.status(500).json({
                    message: "Error interno",
                    ok: false,
                    status: 500
                })
            }
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
    async verify_email(request, response) {
        try {
            const { verify_email_token } = request.query

            await authService.verify_email(verify_email_token)

            response.status(200).send(`<h1>Mail verificado exitosamente</h1>`)
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                return response.status(500).json({
                    message: "Error interno",
                    ok: false,
                    status: 500
                })
            }
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
    async resetPasswordRequest(request, response) {
        try {
            const { email } = request.body
            await authService.resetPasswordRequest({ email })
            return response.status(200).json(
                {
                    message: "Se ha enviado un mail para restablecer la contraseña",
                    ok: true,
                    status: 200
                }
            )
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                return response.status(500).json({
                    message: "Error interno",
                    ok: false,
                    status: 500
                })
            }
        }
    }

    /**
     * @async
     * @function resetPassword
     * @description Recibe el token desde params de la URL y la nueva password desde body para aplicarlo a la cuenta del usuario.
     * @param {Object} request - Parametros params y body de Request.
     * @param {Object} response - Response.
     * @returns {Promise<Object>}
     */
    async resetPassword(request, response) {
        try {
            const { password } = request.body
            const { reset_token } = request.params
            await authService.resetPassword({ password, reset_token })
            return response.status(200).json(
                {
                    message: "Se ha restablecido la contraseña",
                    ok: true,
                    status: 200
                }
            )
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                return response.status(500).json({
                    message: "Error interno",
                    ok: false,
                    status: 500
                })
            }
        }
    }
}

/**
 * @constant {AuthController} authController
 * @description Instancia del controlador de autenticación exportada para ser usada en las rutas.
 */
const authController = new AuthController()
export default authController