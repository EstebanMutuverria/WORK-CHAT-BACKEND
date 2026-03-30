/**
 * @fileoverview Repositorio para la gestión de miembros de los espacios de trabajo.
 * Contiene la clase que abstrae las interacciones con el modelo de base de datos MemberWorkspace.
 */

import MemberWorkspace from "../models/memberWorkspace.model.js"

/**
 * @class MemberWorkspacerepository
 * @description Clase que proporciona métodos para administrar la relación entre usuarios y espacios de trabajo en Mongoose.
 */
class MemberWorkspacerepository {
    /**
     * @async
     * @function create
     * @description Asocia un usuario a un espacio de trabajo con un rol específico.
     * @param {string} fk_id_workspace - ID del espacio de trabajo.
     * @param {string} fk_id_user - ID del usuario.
     * @param {string} role - Rol asignado al usuario en el espacio.
     * @returns {Promise<void>}
     */
    async create(fk_id_workspace, fk_id_user, role) {
        await MemberWorkspace.create({
            fk_id_workspace: fk_id_workspace,
            fk_id_user: fk_id_user,
            role: role
        })
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina la asociación de un miembro a partir de su ID de registro.
     * @param {string} id - ID del documento MemberWorkspace a eliminar.
     * @returns {Promise<void>}
     */
    async deleteById(id) {
        await MemberWorkspace.findByIdAndDelete(id)
    }

    /**
     * @async
     * @function getById
     * @description Obtiene el registro de un miembro por su ID.
     * @param {string} id - ID del documento MemberWorkspace buscado.
     * @returns {Promise<Object>} El documento MemberWorkspace encontrado.
     */
    async getById(id) {
        return await MemberWorkspace.findById(id)
    }

    /**
     * @async
     * @function updateById
     * @description Actualiza las propiedades de un registro MemberWorkspace.
     * @param {Object} new_props - Objeto con las propiedades a actualizar, debe incluir el 'id'.
     * @returns {Promise<Object>} El documento actualizado.
     */
    async updateById(new_props) {
        const new_memberWorkspace = await MemberWorkspace.findByIdAndUpdate(new_props.id, new_props, { new: true })

        return new_memberWorkspace
    }

    /**
     * @async
     * @function updateRole
     * @description Actualiza únicamente el rol de un miembro en particular.
     * @param {string} id - ID del documento MemberWorkspace.
     * @param {string} role - Nuevo rol a asignar.
     * @returns {Promise<void>}
     */
    async updateRole(id, role) {
        await MemberWorkspace.findByIdAndUpdate(id, { role: role })
    }

    /**
     * @async
     * @function getMemberList
     * @description Obtiene la lista completa de miembros pertenecientes a un espacio de trabajo,
     * poblando los datos del usuario y del espacio asociado. Mapea la estructura devuelta para estandarizarla.
     * @param {string} work_space_id - ID del espacio de trabajo del cual obtener los miembros.
     * @returns {Promise<Array<Object>>} Un array de objetos con información detallada de cada miembro.
     */
    async getMemberList(work_space_id) {
        const member_list = await MemberWorkspace.find({ fk_id_workspace: work_space_id })
            .populate("fk_id_user", "user_name email")
            .populate("fk_id_workspace", "title description")

        const member_list_mapped = member_list.map((member) => {
            return {
                member_id: member._id,
                member_role: member.role,
                member_created_at: member.created_at,

                user_name: member.fk_id_user.user_name,
                user_email: member.fk_id_user.email,

                workspace_title: member.fk_id_workspace.title,
                workspace_description: member.fk_id_workspace.description
            }
        })
        console.log("Member List: ", member_list_mapped)
        return member_list_mapped
    }

    async getWorkspaceListByUserId(user_id) {
        const workspacesList = await MemberWorkspace.find({ fk_id_user: user_id })
            .populate('fk_id_workspace', 'title description')

        const workspaces_mapped = workspacesList.map(
            (workspace) => {
                return {
                    workspace_id: workspace.fk_id_workspace._id,
                    workspace_title: workspace.fk_id_workspace.title,
                    workspace_description: workspace.fk_id_workspace.description
                }
            }
        )

        return workspaces_mapped
    }

}

/**
 * @constant {MemberWorkspacerepository} memberWorkspaceRepository
 * @description Instancia singleton del repositorio exportada por defecto.
 */
const memberWorkspaceRepository = new MemberWorkspacerepository()
export default memberWorkspaceRepository