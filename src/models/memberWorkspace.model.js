/**
 * @fileoverview Modelo de base de datos para los miembros de un espacio de trabajo.
 * Define el esquema de Mongoose para la relación entre usuarios y espacios de trabajo.
 */

import mongoose from "mongoose"

/**
 * @constant {mongoose.Schema} memberWorkspaceSchema
 * @description Esquema de Mongoose que define qué usuarios pertenecen a un espacio de trabajo y su respectivo rol.
 * @property {mongoose.Schema.Types.ObjectId} fk_id_workspace - Referencia al espacio de trabajo. Es requerido.
 * @property {mongoose.Schema.Types.ObjectId} fk_id_user - Referencia al usuario miembro. Es requerido.
 * @property {string} role - Rol del usuario en el espacio ('owner', 'user', 'admin'). Por defecto es 'user'.
 * @property {Date} created_at - Fecha en la que el usuario fue agregado como miembro. Por defecto es la fecha actual.
 */
const memberWorkspaceSchema = new mongoose.Schema({
    fk_id_workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    fk_id_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        enum:[
            "owner",
            "user",
            "admin"
        ],
        default: "user"
    },
    created_at:{
        type:Date,
        required:true,
        default:Date.now
    }
})

/**
 * @constant {mongoose.Model} MemberWorkspace
 * @description Modelo de Mongoose para interactuar con la colección de miembros de espacios de trabajo.
 */
const MemberWorkspace = mongoose.model("MemberWorkspace", memberWorkspaceSchema)
export default MemberWorkspace