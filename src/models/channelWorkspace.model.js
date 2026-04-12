/**
 * @fileoverview Modelo de base de datos para los canales de un espacio de trabajo.
 * Define el esquema de Mongoose para la colección de canales (ChannelWorkspace).
 */

import mongoose from "mongoose"

/**
 * @constant {mongoose.Schema} channelWorkspaceSchema
 * @description Esquema de Mongoose que define la estructura de los canales dentro de un espacio de trabajo.
 * @property {string} title - Título o nombre del canal. Es requerido.
 * @property {Date} created_at - Fecha de creación del canal. Por defecto es la fecha actual.
 * @property {string} description - Descripción del propósito o contexto del canal. Es requerido.
 * @property {mongoose.Schema.Types.ObjectId} fk_id_workspace - Referencia al ID del espacio de trabajo al que pertenece. Es requerido.
 */
const channelWorkspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fk_id_workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspace",
        required: true
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true
    }
})

/**
 * @constant {mongoose.Model} ChannelWorkspace
 * @description Modelo de Mongoose compilado a partir de channelWorkspaceSchema.
 * Utilizado para interactuar con la colección 'channelworkspaces' (o la definida por el nombre 'ChannelWorkspace') en la base de datos.
 */
const ChannelWorkspace = mongoose.model("ChannelWorkspace", channelWorkspaceSchema)
export default ChannelWorkspace