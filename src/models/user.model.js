/**
 * @fileoverview Modelo de base de datos para los usuarios del sistema.
 * Define el esquema de Mongoose para el registro y gestión de usuarios.
 */

import mongoose from "mongoose";

/**
 * @constant {mongoose.Schema} userSchema
 * @description Esquema de Mongoose que define los atributos de un usuario.
 * @property {string} user_name - Nombre de usuario, debe ser único y es requerido.
 * @property {string} password - Contraseña encriptada del usuario. Es requerida.
 * @property {boolean} active - Estado de la cuenta del usuario (activa o inactiva). Por defecto true.
 * @property {Date} created_at - Fecha de registro del usuario. Por defecto es la fecha actual.
 * @property {string} email - Correo electrónico del usuario, debe ser único y es requerido.
 * @property {boolean} email_verified - Indica si el email ha sido verificado. Por defecto false.
 * @property {string} url_image - URL de la imagen de perfil del usuario (opcional).
 * @property {string} github - URL del perfil de github del usuario (opcional).
 * @property {string} linkedin - URL del perfil de linkedin del usuario (opcional).
 * @property {string} twitter - URL del perfil de twitter del usuario (opcional).
 * @property {string} instagram - URL del perfil de instagram del usuario (opcional).
 * @property {string} whatsapp - Número de whatsapp del usuario (opcional).
 */
const userSchema = new mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        email_verified: {
            type: Boolean,
            default: false,
            required: true
        },
        url_image: {
            type: String,
            required: false
        },
        github: {
            type: String,
            required: false,
            default: null,
        },
        linkedin: {
            type: String,
            required: false,
            default: null
        },
        twitter: {
            type: String,
            required: false,
            default: null
        },
        instagram: {
            type: String,
            required: false,
            default: null
        }
    }
)

/**
 * @constant {mongoose.Model} User
 * @description Modelo de Mongoose compilado para interactuar con la colección de usuarios.
 */
const User = mongoose.model("User", userSchema)
export default User