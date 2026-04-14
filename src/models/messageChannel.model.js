/**
 * @fileoverview Modelo de base de datos para los mensajes de los canales.
 * Define el esquema de Mongoose para representar un mensaje enviado dentro de un canal.
 */

import mongoose from "mongoose";

/**
 * @constant {mongoose.Schema} messageChannelSchema
 * @description Esquema de Mongoose que define la estructura de datos de un mensaje de canal.
 * @property {string} content - Contenido de texto del mensaje. Es requerido.
 * @property {mongoose.Schema.Types.ObjectId} fk_id_member - Referencia al ID del miembro que envió el mensaje. Es requerido.
 * @property {mongoose.Schema.Types.ObjectId} fk_id_channel - Referencia al ID del canal donde se envió el mensaje. Es requerido.
 * @property {Date} created_at - Fecha y hora de creación del mensaje. Por defecto es la fecha actual.
 */
const messageChannelSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    fk_id_member: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fk_id_channel: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true
    }
})

/**
 * @constant {mongoose.Model} MessageChannel
 * @description Modelo de Mongoose compilado para la colección de mensajes de los canales.
 */
const MessageChannel = mongoose.model("MessageChannel", messageChannelSchema)
export default MessageChannel