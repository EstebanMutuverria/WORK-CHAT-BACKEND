import memberWorkspaceService from "../service/memberWorkspace.service.js";
import { getStatusPage } from "../helper/htmlTemplates.helper.js";
import ENVIRONMENT from "../config/environment.config.js";
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";

/**
 * @class MemberWorkspaceController
 * @description Controlador para manejar las operaciones relacionadas con los miembros de un espacio de trabajo.
 */
class MemberWorkspaceController {

    /**
     * @async
     * @function inviteMember
     * @description Endpoint para enviar una invitación a un nuevo miembro.
     * @param {Object} request - Objeto de solicitud de Express.
     * @param {Object} response - Objeto de respuesta de Express.
     * @param {Function} next - Función para pasar al siguiente middleware de error.
     */
    async inviteMember(request, response, next) {
        try {
            const { workspace_id } = request.params
            const { email, role } = request.body
            const user_id = request.user.id

            await memberWorkspaceService.inviteMember(workspace_id, user_id, email, role)

            return response.status(200).json({
                message: "Invitación enviada correctamente",
                ok: true,
                status: 200
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @async
     * @function respondToInvitation
     * @description Endpoint para procesar la respuesta a una invitación a través de un link.
     * @param {Object} request - Objeto de solicitud de Express.
     * @param {Object} response - Objeto de respuesta de Express.
     * @param {Function} next - Función para pasar al siguiente middleware de error.
     */
    async respondToInvitation(request, response, next) {
        try {
            const { token } = request.query
            const { workspace_id } = request.params

            // Validar que el token esté presente
            if (!token) {
                const html = getStatusPage(false, 'Enlace inválido', 'No se ha proporcionado un token de invitación válido.', 'Volver al Inicio', ENVIRONMENT.FRONTEND_URL)
                return response.status(400).send(html)
            }

            const action = await memberWorkspaceService.respondToInvitation(token)

            const isSuccess = action === 'accepted'
            const title = isSuccess ? '¡Invitación Aceptada!' : 'Invitación Rechazada'
            const message = isSuccess
                ? 'Te has unido exitosamente al espacio de trabajo. Ahora puedes empezar a colaborar con tu equipo.'
                : 'Has rechazado la invitación al espacio de trabajo.'
            const buttonText = isSuccess ? 'Ir al Workspace' : 'Volver al Inicio'
            const buttonLink = isSuccess ? `${ENVIRONMENT.FRONTEND_URL}/workspaces/${workspace_id}` : ENVIRONMENT.FRONTEND_URL

            const html = getStatusPage(isSuccess, title, message, buttonText, buttonLink)

            return response.status(200).send(html)
        } catch (error) {
            const html = getStatusPage(false, 'Error', error.message || 'Hubo un problema al procesar tu invitación.', 'Volver al Inicio', ENVIRONMENT.FRONTEND_URL)
            return response.status(error.status || 500).send(html)
        }
    }

    async delete(request, response, next) {

        try {
            const member_id = request.params.member_id
            const workspace_id = request.params.workspace_id

            const member_deleted = await memberWorkspaceService.delete(workspace_id, member_id)
            return response.status(200).json(
                {
                    message: 'Miembro eliminado correctamente',
                    ok: true,
                    status: 200
                }
            )

        } catch (error) {
            next(error)
        }
    }

    async updateRole(request, response, next) {
        try {
            const member_id = request.params.member_id
            const workspace_id = request.params.workspace_id

            const { role } = request.body

            const member_updated = await memberWorkspaceService.updateRole(member_id, workspace_id, role)
            return response.status(200).json(
                {
                    message: 'Rol del miembro actualizado exitosamente',
                    ok: true,
                    status: 200,
                    data: {
                        member_updated: member_updated
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async getAll(request, response, next) {
        try {
            const workspace_id = request.params.workspace_id

            const memberList = await memberWorkspaceService.getAll(workspace_id)
            return response.status(200).json(
                {
                    message: 'Lista de miembros obtenida exitosamente',
                    ok: true,
                    status: 200,
                    data: {
                        memberList: memberList
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async getByMemberId(request, response, next) {

        try {
            const workspace_id = request.params.workspace_id
            const member_id = request.params.member_id

            const member = await memberWorkspaceService.getByMemberId(workspace_id, member_id)
            return response.status(200).json(
                {
                    message: 'Miembro obtenido exitosamente',
                    ok: true,
                    status: 200,
                    data: {
                        member: member
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }
}

const memberWorkspaceController = new MemberWorkspaceController()
export default memberWorkspaceController
