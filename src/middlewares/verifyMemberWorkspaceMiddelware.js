import ServerError from "../helper/serverError.helper.js"
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js"

function verifyMemberWorkspace(valid_roles = []) {
    return async function (request, response, next) {
        try {
            const workspace_id = request.params.workspace_id
            const user_id = request.user.id

            const member = await memberWorkspaceRepository.getUserByWorkspaceIdAndUserId(workspace_id, user_id)
            if (!member || !user_id) {
                throw new ServerError('No tienes permiso para acceder a este workspace', 403)
            }

            request.member = member

            if (valid_roles.length > 0 && !valid_roles.includes(member.role)) {
                throw new ServerError('No tienes permiso para realizar esta accion', 403)
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}

export default verifyMemberWorkspace