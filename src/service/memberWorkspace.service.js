import ServerError from "../helper/serverError.helper.js";
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import userRepository from "../repository/user.repository.js";
import workspaceService from "./workspace.service.js";
import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/malier.confing.js";
import { getEmailTemplate } from "../helper/htmlTemplates.helper.js";
import AVILABLE_ROLES from "../constants/roles.constants.js";

class MemberWorkspaceService {
    async getWorkspaces(user_id) {

        const member = await memberWorkspaceRepository.getByUserId(user_id)
        if (member && member.acceptInvitation === 'accepted') {

            //traer la lista de espacios de trabajo relacionados a el usuario logueado
            const workspacesList = await memberWorkspaceRepository.getWorkspaceListByUserId(user_id)
            return workspacesList
        }
    }

    async create(workspace_id, user_id, role) {
        const result = await memberWorkspaceRepository.getUserByWorkspaceIdAndUserId(workspace_id, user_id)
        if (result) {
            throw new ServerError('El usuario ya existe en este espacio de trabajo', 400)
        }

        await memberWorkspaceRepository.create(workspace_id, user_id, role)
    }

    /**
     * @async
     * @function inviteMember
     * @description Envía una invitación por correo a un usuario para unirse a un espacio de trabajo.
     * @param {string} workspace_id - ID del espacio de trabajo.
     * @param {string} invited_by_user_id - ID del usuario que invita (admin/owner).
     * @param {string} email - Email del usuario invitado.
     * @param {string} role - Rol que tendrá el usuario si acepta.
     * @returns {Promise<void>}
     */
    async inviteMember(workspace_id, invited_by_user_id, email, role) {
        // 1. Verificar si el usuario a invitar existe en la BD
        const invitedUser = await userRepository.getByEmail(email)
        if (!invitedUser) {
            throw new ServerError('El usuario con el email proporcionado no está registrado en WorkChat. Para invitarlo, primero debe crearse una cuenta.', 404)
        }

        // 2. Verificar si ya es miembro o tiene invitación pendiente
        const existingMember = await memberWorkspaceRepository.getUserByWorkspaceIdAndUserId(workspace_id, invitedUser._id)
        if (existingMember) {
            if (existingMember.acceptInvitation === 'pending') {
                throw new ServerError('Ya existe una invitación pendiente para este usuario en este espacio de trabajo.', 400)
            }
            throw new ServerError('El usuario ya es miembro de este espacio de trabajo.', 400)
        }

        // 3. Crear el registro en MemberWorkspace con status 'pending'
        const invitation = await memberWorkspaceRepository.create(workspace_id, invitedUser._id, role)

        // 4. Generar tokens para aceptar y rechazar
        const acceptToken = jwt.sign(
            { action: 'accepted', invitation_id: invitation._id },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )
        const rejectToken = jwt.sign(
            { action: 'rejected', invitation_id: invitation._id },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        // 5. Preparar enlaces
        const acceptLink = `${ENVIRONMENT.URL_BACKEND}/api/workspaces/${workspace_id}/members?token=${acceptToken}`
        const rejectLink = `${ENVIRONMENT.URL_BACKEND}/api/workspaces/${workspace_id}/members?token=${rejectToken}`

        // 6. Obtener info del workspace para el email
        const workspace = await workspaceRepository.getById(workspace_id)

        // 7. Enviar email
        // Usamos el template existente para el enlace de aceptar y añadimos el de rechazar manualmente o en el mensaje
        const title = `Invitación a unirse a ${workspace.title}`
        const message = `Has sido invitado a unirte al espacio de trabajo <b>${workspace.title}</b> con el rol de <b>${role}</b>.<br><br>Si deseas rechazar esta invitación, puedes hacerlo haciendo <a href="${rejectLink}">clic aquí</a>.`

        const html = getEmailTemplate(title, message, 'Aceptar Invitación', acceptLink)

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: `Invitación a ${workspace.title} - WorkChat`,
            html: html
        })
    }

    /**
     * @async
     * @function respondToInvitation
     * @description Procesa la respuesta de un usuario a una invitación (aceptar/rechazar).
     * @param {string} token - Token JWT con la acción y el ID de la invitación.
     * @returns {Promise<string>} La acción realizada ('accepted' o 'rejected').
     */
    async respondToInvitation(token) {
        try {
            const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)
            const { action, invitation_id } = decoded

            const invitation = await memberWorkspaceRepository.getById(invitation_id)
            if (!invitation) {
                throw new ServerError('La invitación no existe o ha sido eliminada.', 404)
            }

            if (invitation.acceptInvitation !== 'pending') {
                throw new ServerError('Esta invitación ya ha sido procesada previamente.', 400)
            }

            await memberWorkspaceRepository.updateInvitationStatus(invitation_id, action)
            return action
        } catch (error) {
            if (error instanceof ServerError) throw error
            throw new ServerError('Token de invitación inválido o expirado.', 401)
        }
    }

    async delete(workspace_id, member_id, requester_member) {
        if (!workspace_id) {
            throw new ServerError('No se especifico un espacio de trabajo', 404)
        }
        if (!member_id) {
            throw new ServerError('No se especifico un miembro del espacio de trabajo', 400)
        }

        const member_to_delete = await memberWorkspaceRepository.getById(member_id)
        if (!member_to_delete) {
            throw new ServerError('No se encontró el miembro especificado', 404)
        }

        // Validación de permisos:
        // Si hay un requester_member, validamos que tenga permiso para eliminar
        if (requester_member) {
            const isDeletingSelf = requester_member._id.toString() === member_to_delete._id.toString()
            const isRequesterAdminOrOwner = requester_member.role === AVILABLE_ROLES.OWNER || requester_member.role === AVILABLE_ROLES.ADMIN

            if (!isDeletingSelf && !isRequesterAdminOrOwner) {
                throw new ServerError('No tienes permiso para eliminar a este miembro', 403)
            }
        }

        if (member_to_delete.role === AVILABLE_ROLES.OWNER) {
            // 1. Obtener todos los miembros del espacio de trabajo
            const members = await memberWorkspaceRepository.getMemberList(workspace_id)
            
            // 2. Filtrar al dueño actual
            const otherMembers = members.filter(m => m.user_id.toString() !== member_to_delete.fk_id_user.toString())

            if (otherMembers.length === 0) {
                // Si no hay más miembros, eliminamos el workspace completo
                await workspaceService.deleteById(workspace_id)
                return { status: 200, message: 'Espacio de trabajo eliminado correctamente al ser el único miembro' }
            } else {
                // 3. Buscar candidatos para nuevo owner (Administrador más antiguo > Usuario más antiguo)
                let newOwner = otherMembers
                    .filter(m => m.member_role === AVILABLE_ROLES.ADMIN)
                    .sort((a, b) => new Date(a.member_created_at) - new Date(b.member_created_at))[0]

                if (!newOwner) {
                    newOwner = otherMembers
                        .filter(m => m.member_role === AVILABLE_ROLES.USER)
                        .sort((a, b) => new Date(a.member_created_at) - new Date(b.member_created_at))[0]
                }

                if (newOwner) {
                    // 4. Transferir rol de owner al nuevo candidato
                    await memberWorkspaceRepository.updateRole(newOwner.member_id, AVILABLE_ROLES.OWNER)
                }
            }
        }

        // 5. Eliminar la membresía del usuario (sea owner o no)
        const member_deleted = await memberWorkspaceRepository.deleteById(member_id)
        return member_deleted
    }

    async updateRole(member_id, workspace_id, role) {
        if (!workspace_id) {
            throw new ServerError('No se especifico un espacio de trabajo', 404)
        }
        if (!member_id) {
            throw new ServerError('No se especifico un miembro del espacio de trabajo')
        }

        const member = await memberWorkspaceRepository.getById(member_id)
        if (member.role === AVILABLE_ROLES.OWNER) {
            throw new ServerError('No se puede actualizar el rol de el dueño del espacio de trabajo')
        }

        const member_updated = await memberWorkspaceRepository.updateRole(member_id, role)
        return member_updated
    }

    async getAll(workspace_id) {
        if (!workspace_id) {
            throw new ServerError('Espacio de trabajo no especificado', 404)
        }

        const memberList = await memberWorkspaceRepository.getMemberList(workspace_id)
        return memberList
    }

    async getByMemberId(workspace_id, member_id) {
        if (!workspace_id) {
            throw new ServerError('Espacio de trabajo no especificado', 404)
        }

        if (!member_id) {
            throw new ServerError('Miembro no especificado', 404)
        }

        const member = await memberWorkspaceRepository.getById(member_id)
        return member
    }
}

const memberWorkspaceService = new MemberWorkspaceService()
export default memberWorkspaceService