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
        const memberWorkspace_created = await MemberWorkspace.create({
            fk_id_workspace: fk_id_workspace,
            fk_id_user: fk_id_user,
            role: role
        })

        return memberWorkspace_created
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina la asociación de un miembro a partir de su ID de registro.
     * @param {string} id - ID del documento MemberWorkspace a eliminar.
     * @returns {Promise<void>}
     */
    async deleteById(member_id) {
        await MemberWorkspace.findByIdAndDelete(member_id)
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

    async updateRole(member_id, role) {
        const member_updated = await MemberWorkspace.findByIdAndUpdate(member_id, { role: role }, { new: true })
        return member_updated
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

        const validMembers = member_list.filter(
            (member) => member.fk_id_workspace !== null && member.fk_id_user !== null
        )

        const member_list_mapped = validMembers.map((member) => {
            return {
                member_id: member._id,
                member_role: member.role,
                member_created_at: member.created_at,

                user_name: member.fk_id_user.user_name,
                user_email: member.fk_id_user.email,
            }
        })
        return member_list_mapped
    }

    async getWorkspaceListByUserId(user_id) {
        const workspacesList = await MemberWorkspace.find({ fk_id_user: user_id })
            .populate('fk_id_workspace', 'title description')
            .populate('fk_id_user', 'user_name email')

        // Filter out any orphaned records where the workspace or user was deleted
        const validWorkspaces = workspacesList.filter(
            (workspace) => workspace.fk_id_workspace !== null && workspace.fk_id_user !== null
        )

        const workspaces_mapped = validWorkspaces.map(
            (workspace) => {
                return {
                    workspace_id: workspace.fk_id_workspace._id,
                    workspace_title: workspace.fk_id_workspace.title,
                    workspace_description: workspace.fk_id_workspace.description,
                    user_name: workspace.fk_id_user.user_name,
                    user_email: workspace.fk_id_user.email
                }
            }
        )

        return workspaces_mapped
    }

    async getUserByWorkspaceIdAndUserId(workspace_id, user_id) {
        const member = await MemberWorkspace.findOne({ fk_id_workspace: workspace_id, fk_id_user: user_id })
        return member
    }

    async getWorkspaceByUserAndWorkspaceId(workspace_id, user_id) {
        const workspace = await MemberWorkspace.findOne({ fk_id_workspace: workspace_id, fk_id_user: user_id })
            .populate('fk_id_workspace', 'title description url_image')
        const workspaceMapped = {
            workspace_id: workspace.fk_id_workspace._id,
            workspace_title: workspace.fk_id_workspace.title,
            workspace_description: workspace.fk_id_workspace.description,
            workspace_url_image: workspace.fk_id_workspace.url_image
        }
        return workspaceMapped
    }

    /**
     * @async
     * @function updateInvitationStatus
     * @description Actualiza el estado de la invitación de un miembro.
     * @param {string} id - ID del documento MemberWorkspace.
     * @param {string} status - Nuevo estado ('accepted', 'rejected').
     * @returns {Promise<Object>} El documento actualizado.
     */
    async updateInvitationStatus(id, status) {
        return await MemberWorkspace.findByIdAndUpdate(id, { acceptInvitation: status }, { new: true })
    }

}

/**
 * @constant {MemberWorkspacerepository} memberWorkspaceRepository
 * @description Instancia singleton del repositorio exportada por defecto.
 */
const memberWorkspaceRepository = new MemberWorkspacerepository()
export default memberWorkspaceRepository