/**
 * @fileoverview Servicio de Autenticación.
 * Contiene la lógica principal de negocio para el registro, inicio de sesión, y verificación de usuarios.
 */

//Responsanilidad de manejar la capa de negocio

import ENVIRONMENT from "../config/environment.config.js"
import mailerTransporter from "../config/malier.confing.js"
import ServerError from "../helper/serverError.helper.js"
import userRepository from "../repository/user.repository.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

//Registro:
//Validar que el usuario no exista previamente en la DB (con el mismo mail), si existe dar error con status: 400
//Guardar el usuario en la DB
//Enviar un mail de verificacion
//Para crear una cienta e mail debe estar sobre el dominion de la empresa que lo registra, por ejemplo: @company.com - pepe@company.com

/**
 * @class AuthService
 * @description Clase que maneja toda la lógica de validación, encriptación de datos, y manejo de tokens relacionados con usuarios.
 */
class AuthService {
    /**
     * @async
     * @function register
     * @description Funcionalidad para registrar un usuario nuevo en el sistema.
     * Se valida la no existencia del mail, se encripta la contraseña, se guarda y se envía email de verificación.
     * @param {Object} payload - Objeto con los datos del usuario.
     * @param {string} payload.user_name - Nombre del usuario a registrarse.
     * @param {string} payload.password - Contraseña en texto plano a registrarse.
     * @param {string} payload.email - Email con el que se registrará.
     * @throws {ServerError} Si faltan campos o si el correo ya existe.
     * @returns {Promise<void>}
     */
    async register({ user_name, password, email }) {
        if (!user_name || !password || !email) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        const getUserByEmail = await userRepository.getByEmail(email)
        if (getUserByEmail) {
            throw new ServerError("Ya existe un usuario con esa direccion de mail", 400)
        }

        const passwordHashed = await bcrypt.hash(password, 12)
        const userCreated = await userRepository.create(user_name, passwordHashed, email)
        await this.sendVerifyEmail({ email, user_name })
    }

    /**
     * @async
     * @function login
     * @description Valida las credenciales de un usuario y devuelve un token JWT en caso de ser correctas.
     * También verifica que el usuario haya confirmado previamente su email.
     * @param {Object} payload - Objeto con los datos para iniciar sesión.
     * @param {string} payload.email - Correo del usuario.
     * @param {string} payload.password - Contraseña del usuario.
     * @throws {ServerError} Si faltan campos, no se encuentra el usuario, no tiene el email verificado, o si la contraseña es incorrecta.
     * @returns {Promise<string>} Token JWT firmado (auth_token).
     */
    async login({ email, password }) {
        if (!email || !password) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        const user = await userRepository.getByEmail(email)
        if (!user) {
            throw new ServerError("Usuario no encontrado", 404)
        }
        if (!user.email_verified) {
            throw new ServerError("Usuario no verificado", 403)
        }

        const is_same_password = await bcrypt.compare(password, user.password)
        if (!is_same_password) {
            throw new ServerError('Contraseña incorrecta', 401)
        }

        const auth_token = jwt.sign(
            {
                email: user.email,
                name: user.user_name,
                created_at: user.created_at,
                id: user._id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )
        return auth_token
    }

    /**
     * @async
     * @function verify_email
     * @description Verifica la validez de un token enviado por email al momento de registro, 
     * cambiando el estado del usuario a "email_verified = true".
     * @param {string} verify_email_token - El token de validación.
     * @throws {ServerError} Si el token no está, es inválido, expiró, el usuario ya no existe, o ya fue validado.
     * @returns {Promise<Object|void>} El usuario actualizado.
     */
    async verify_email(verify_email_token) {
        if (!verify_email_token) {
            throw new ServerError('No se encuentra el token', 400)
        }

        try {
            //Esto es clave, gracias a esto sabemos si el token fue creado por nosotros
            const { email, user_name } = jwt.verify(verify_email_token, ENVIRONMENT.JWT_SECRET_KEY)

            const user = await userRepository.getByEmail(email)
            if (!user) {
                throw new ServerError('El usuario no existe', 404)
            } else if (user.email_verified) {
                throw new ServerError('Usuario con email ya validado', 400)
            } else {
                const user_updated = await userRepository.updateById(user._id, { email_verified: true })
                if (!user_updated) {
                    throw new ServerError('No fue posible actualizar el usuario', 400)
                } else {
                    return user_updated
                }
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                //Esto nos permite leer el token pero no verifica la firma
                const { email, user_name } = jwt.decode(verify_email_token)
                //Enviar otro mail de verificacion y crear otro token
                await this.sendVerifyEmail({ email, user_name })
                throw new ServerError('El token de validacion expiro', 401)
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Token invalido', 401) //401 desautorizado
            } else {
                throw error
            }
        }

        if (!token_verified) {
            throw new ServerError('Token invalido', 400)
        }

        userRepository.updateById({ email_verified })
        console.log('El usuario intento verificar su email, token de validacion: ' + verify_email_token)
    }

    /**
     * @async
     * @function sendVerifyEmail
     * @description Crea un token con vigencia de 7 días y envía un correo mediante `mailerTransporter` para que el usuario pueda validar su cuenta.
     * @param {Object} payload - Información del usuario.
     * @param {string} payload.email - Email receptor.
     * @param {string} payload.user_name - Nombre para mostar en el saludo.
     * @returns {Promise<void>}
     */
    async sendVerifyEmail({ email, user_name }) {
        const verify_email_token = jwt.sign(
            {
                //Primer objeto que se le pasa a sign() es el payload, en este caso es el mail del usuario a registrar
                email: email,
                user_name: user_name
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: `Bienvenido ${user_name}, verifica tu cuenta`,
            html: `
            <h2>Bienvenido ${user_name}</h2>
            <p>te has registrado correctamente, necesitamos que verifique tu cuenta.</p>
            <a href="${ENVIRONMENT.URL_BACKEND + `/api/auth/verify-email?verify_email_token=${verify_email_token}`}">hace click acá para verificarla</a>
            <p>Si no reconoces este registro desestima el mail</p>
            `
        })
    }

    /**
     * @async
     * @function resetPasswordRequest
     * @description Inicia el flujo de recuperación de contraseña generando un token y enviándolo al correo correspondiente.
     * @param {Object} payload - Objeto que trae el email a recuperar.
     * @param {string} payload.email - El email del usuario que solicitó el restablecimiento.
     * @throws {ServerError} Si falta el correo electrónico o el usuario asociado no se encuentra.
     * @returns {Promise<void>}
     */
    async resetPasswordRequest({ email }) {
        try {
            if (!email) {
                throw new ServerError('El email es obligatorio', 400)
            }

            const user = await userRepository.getByEmail(email)
            if (!user) {
                throw new ServerError('El usuario no existe', 404)
            }

            const resetPasswordToken = jwt.sign(
                {
                    email
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                {
                    expiresIn: '1d'
                }
            )

            mailerTransporter.sendMail(
                {
                    from: ENVIRONMENT.MAIL_USER,
                    to: email,
                    subject: 'restablecimiento de contraseña',
                    html: `
                        <h1>Restablecimiento de contraseña</h1>
                        <p>Se ha solicitado un restablecimiento de contraseña para tu cuenta.</p>
                        <p>Si no has solicitado este cambio, por favor ignora este correo.</p>
                        <a href="${ENVIRONMENT.URL_BACKEND + `/api/auth/reset-password-request?reset_password_token=${resetPasswordToken}`}">Haz clic aquí para restablecer tu contraseña</a>
                        <span>Este enlace expirará en 1 día.</span> 
                    `
                }
            )
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ServerError('El token de restablecimiento de contraseña ha expirado', 401)
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Token invalido', 401)
            } else {
                throw error
            }
        }
    }

    /**
     * @async
     * @function resetPassword
     * @description Toma la nueva contraseña, verifica y decodifica el token reseteo, y guarda la nueva credencial.
     * @param {Object} payload - Objeto con los datos de reseteo.
     * @param {string} payload.password - La nueva contraseña elegida.
     * @param {string} payload.reset_token - El token que da autorización para hacer el cambio, proveniente del link por email.
     * @throws {ServerError} Si falta un campo, el token expiró, es invalido, o no se encontró al usuario.
     * @returns {Promise<void>}
     */
    async resetPassword({ password, reset_token }) {
        try {
            if (!password || !reset_token) {
                throw new ServerError('Todos los campos son obligatorios', 400)
            }

            const { email } = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET_KEY)
            const user = await userRepository.getByEmail(email)
            if (!user) {
                throw new ServerError('El usuario no existe', 404)
            }

            const passwordHashed = await bcrypt.hash(password, 12)
            const user_updated = await userRepository.updateById(user._id, { password: passwordHashed })
            if (!user_updated) {
                throw new ServerError('No fue posible actualizar el usuario', 400)
            }

        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ServerError('El token de restablecimiento de contraseña ha expirado', 401)
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Token invalido', 401)
            } else {
                throw error
            }
        }
    }
}

/**
 * @constant {AuthService} authService
 * @description Instancia de los servicios de Autenticación lista para ser inyectada en los controladores.
 */
const authService = new AuthService()
export default authService