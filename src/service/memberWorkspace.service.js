import ServerError from "../helper/serverError.helper.js";
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import userRepository from "../repository/user.repository.js";
import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/malier.confing.js";
import { getEmailTemplate } from "../helper/htmlTemplates.helper.js";
import AVILABLE_ROLES from "../constants/roles.constants.js";

class MemberWorkspaceService {
    async getWorkspaces(user_id) {
        //traer la lista de espacios de trabajo relacionados a el usuario logueado
        const workspacesList = await memberWorkspaceRepository.getWorkspaceListByUserId(user_id)
        return workspacesList
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

    async delete(workspace_id, member_id) {
        if (!workspace_id) {
            throw new ServerError('No se especifico un espacio de trabajo', 404)
        }
        if (!member_id) {
            throw new ServerError('No se especifico un miembro del espacio de trabajo')
        }

        const member = await memberWorkspaceRepository.getById(member_id)
        if (member.role === AVILABLE_ROLES.OWNER) {
            throw new ServerError('No se puede eliminar al dueño del espacio de trabajo')
        }

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
}

const memberWorkspaceService = new MemberWorkspaceService()
export default memberWorkspaceService