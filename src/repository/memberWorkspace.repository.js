/**
 * @fileoverview Repositorio para la gestión de miembros de los espacios de trabajo.
 * Contiene la clase que abstrae las interacciones con el modelo de base de datos MemberWorkspace.
 */

import MemberWorkspace from "../models/memberWorkspace.model.js"
import ServerError from "../helper/serverError.helper.js";
import { repositoryErrorHandler } from "../middlewares/errorHandler.js";

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
        try {
            const memberWorkspace_created = await MemberWorkspace.create({
                fk_id_workspace: fk_id_workspace,
                fk_id_user: fk_id_user,
                role: role,
                acceptInvitation: role === 'owner' ? 'accepted' : 'pending'
            })

            return memberWorkspace_created
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina la asociación de un miembro a partir de su ID de registro.
     * @param {string} id - ID del documento MemberWorkspace a eliminar.
     * @returns {Promise<void>}
     */
    async deleteById(member_id) {
        try {
            await MemberWorkspace.findByIdAndDelete(member_id)
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function deleteByWorkspaceId
     * @description Elimina todos los miembros asociados a un workspace_id.
     * @param {string} workspace_id - ID del espacio de trabajo.
     */
    async deleteByWorkspaceId(workspace_id) {
        try {
            await MemberWorkspace.deleteMany({ fk_id_workspace: workspace_id })
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function getById
     * @description Obtiene el registro de un miembro por su ID.
     * @param {string} id - ID del documento MemberWorkspace buscado.
     * @returns {Promise<Object>} El documento MemberWorkspace encontrado.
     */
    async getById(id) {
        try {
            return await MemberWorkspace.findById(id)
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function updateById
     * @description Actualiza las propiedades de un registro MemberWorkspace.
     * @param {Object} new_props - Objeto con las propiedades a actualizar, debe incluir el 'id'.
     * @returns {Promise<Object>} El documento actualizado.
     */
    async updateById(new_props) {
        try {
            const new_memberWorkspace = await MemberWorkspace.findByIdAndUpdate(new_props.id, new_props, { new: true })

            return new_memberWorkspace
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function updateRole
     * @description Actualiza únicamente el rol de un miembro en particular.
     * @param {string} id - ID del documento MemberWorkspace.
     * @param {string} role - Nuevo rol a asignar.
     * @returns {Promise<Object>} El documento actualizado.
     */
    async updateRole(id, role) {
        try {
            const member_updated = await MemberWorkspace.findByIdAndUpdate(id, { role: role }, { new: true })
            return member_updated
        } catch (error) {
            repositoryErrorHandler(error)
        }
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
        try {
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
                    member_acceptInvitation: member.acceptInvitation,

                    user_name: member.fk_id_user?.user_name || 'Usuario desconocido',
                    user_email: member.fk_id_user?.email || 'N/A',
                }
            })
            return member_list_mapped
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    async getWorkspaceListByUserId(user_id) {
        try {
            const workspacesList = await MemberWorkspace.find({ fk_id_user: user_id })
                .populate('fk_id_workspace', 'title description url_image')
                .populate('fk_id_user', 'user_name email')

            // Filter out any orphaned records where the workspace or user was deleted
            const validWorkspaces = workspacesList.filter(
                (workspace) => workspace.fk_id_workspace !== null && workspace.fk_id_user !== null
            )

            const workspaces_mapped = validWorkspaces.map(
                (workspace) => {
                    return {
                        workspace_id: workspace.fk_id_workspace?._id,
                        workspace_title: workspace.fk_id_workspace?.title || 'Espacio desconocido',
                        workspace_description: workspace.fk_id_workspace?.description || '',
                        workspace_image: workspace.fk_id_workspace?.url_image || '',
                        workspace_role: workspace.role,
                        user_name: workspace.fk_id_user?.user_name || 'Usuario desconocido',
                        user_email: workspace.fk_id_user?.email || 'N/A'
                    }
                }
            )

            return workspaces_mapped
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    async getUserByWorkspaceIdAndUserId(workspace_id, user_id) {
        try {
            const member = await MemberWorkspace.findOne({ fk_id_workspace: workspace_id, fk_id_user: user_id })
            return member
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    async getWorkspaceByUserAndWorkspaceId(workspace_id, user_id) {
        try {
            const workspace = await MemberWorkspace.findOne({ fk_id_workspace: workspace_id, fk_id_user: user_id })
                .populate('fk_id_workspace', 'title description url_image')

            if (!workspace || !workspace.fk_id_workspace) {
                return null;
            }

            const workspaceMapped = {
                workspace_id: workspace.fk_id_workspace._id,
                workspace_title: workspace.fk_id_workspace.title,
                workspace_description: workspace.fk_id_workspace.description,
                workspace_image: workspace.fk_id_workspace.url_image
            }
            return workspaceMapped
        } catch (error) {
            repositoryErrorHandler(error)
        }
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
        try {
            return await MemberWorkspace.findByIdAndUpdate(id, { acceptInvitation: status }, { new: true })
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }
}

/**
 * @constant {MemberWorkspacerepository} memberWorkspaceRepository
 * @description Instancia singleton del repositorio exportada por defecto.
 */
const memberWorkspaceRepository = new MemberWorkspacerepository()
export default memberWorkspaceRepository