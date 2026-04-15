/**
 * @fileoverview Modelo de base de datos para los espacios de trabajo (Workspaces).
 * Define el esquema de Mongoose para la colección principal de entidades de entorno colaborativo.
 */

import mongoose from "mongoose"

/**
 * @constant {mongoose.Schema} workspaceSchema
 * @description Esquema de Mongoose que define la estructura de datos de un espacio de trabajo.
 * @property {string} title - Título principal o nombre del espacio de trabajo. Es requerido.
 * @property {Date} created_at - Fecha de creación. Por defecto es la fecha actual.
 * @property {string} description - Descripción opcional del propósito del espacio de trabajo.
 * @property {string} url_image - URL de un ícono o imagen representativa del espacio. Es requerido.
 * @property {boolean} active - Indica si el espacio de trabajo se encuentra habilitado. Por defecto true.
 */
const workspaceSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    description:{
        type:String,
        required:false
    },
    url_image:{
        type:String,
        required:false
    },
    active:{
        type:Boolean,
        default:true
    }
})

/**
 * @constant {mongoose.Model} Workspace
 * @description Modelo de Mongoose compilado para realizar operaciones sobre la colección de Workspaces.
 */
const Workspace = mongoose.model("Workspace", workspaceSchema)
export default Workspace