/**
 * @fileoverview Modelo de base de datos para los canales de un espacio de trabajo.
 * Define el esquema de Mongoose para la colección de canales (ChanellWorkspace).
 */

import mongoose from "mongoose"

/**
 * @constant {mongoose.Schema} chanellWorkspaneSchema
 * @description Esquema de Mongoose que define la estructura de los canales dentro de un espacio de trabajo.
 * @property {string} title - Título o nombre del canal. Es requerido.
 * @property {Date} created_at - Fecha de creación del canal. Por defecto es la fecha actual.
 * @property {string} description - Descripción del propósito o contexto del canal. Es requerido.
 * @property {mongoose.Schema.Types.ObjectId} fk_id_workspace - Referencia al ID del espacio de trabajo al que pertenece. Es requerido.
 */
const chanellWorkspaneSchema = new mongoose.Schema({
    title:{
        type:String,
        requered:true
    },
    created_at:{
        type:Date,
        default:Date.now,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    fk_id_workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"workspace",
        required:true
    }
})

/**
 * @constant {mongoose.Model} ChanellWorkspace
 * @description Modelo de Mongoose compilado a partir de chanellWorkspaneSchema.
 * Utilizado para interactuar con la colección 'chanellworkspaces' (o la definida por el nombre 'ChanellWorkspace') en la base de datos.
 */
const ChanellWorkspace = mongoose.model("ChanellWorkspace", chanellWorkspaneSchema)
export default ChanellWorkspace