/**
 * @fileoverview Definición de las rutas relacionadas con la Autenticación.
 * Asocia cada endpoint de '/api/auth' con su método correspondiente en el AuthController.
 */

import express from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
const authRouter = express.Router()

/**
 * @route POST /api/auth/register
 * @description Endpoint para registrar un nuevo usuario en el sistema.
 * @access Public
 */
authRouter.post(
    '/register',
    authController.userRegistration
)

/**
 * @route POST /api/auth/login
 * @description Endpoint para iniciar sesión y obtener el token de autenticación.
 * @access Public
 */
authRouter.post(
    '/login',
    authController.login
)

/**
 * @route GET /api/auth/verify-email
 * @description Endpoint para verificar el correo mediante un token enviado por URL.
 * @access Public
 */
authRouter.get(
    '/verify-email',
    authController.verify_email
)

/**
 * @route POST /api/auth/reset-password-request
 * @description Endpoint para solicitar el restablecimiento de contraseña vía mail.
 * @access Public
 */
authRouter.post(
    '/reset-password-request',
    authController.resetPasswordRequest
)

/**
 * @route GET /api/auth/reset-password/:reset_token
 * @description Muestra el formulario para restablecer la contraseña.
 * @access Public
 */
authRouter.get(
    '/reset-password/:reset_token',
    authController.renderResetPassword
)

/**
 * @route POST /api/auth/reset-password/:reset_token
 * @description Endpoint para confirmar la nueva contraseña junto con su token de autorización.
 * @access Public
 */
authRouter.post(
    '/reset-password/:reset_token',
    authController.resetPassword
)

/**
 * @route GET /api/auth/verify
 * @description Endpoint para verificar si el usuario logueado sigue existiendo en la DB.
 * @access Private
 */
authRouter.get(
    '/verify',
    authMiddleware,
    authController.verifyToken
)

export default authRouter