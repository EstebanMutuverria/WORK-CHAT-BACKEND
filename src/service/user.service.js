import ServerError from "../helper/serverError.helper.js"
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js"
import userRepository from "../repository/user.repository.js"
import AVILABLE_ROLES from "../constants/roles.constants.js"
import workspaceService from "./workspace.service.js"
import memberWorkspaceService from "./memberWorkspace.service.js"

class UserService {
    async updateById(id, name) {
        if (!name) {
            throw new ServerError('El nombre es requerido', 400)
        }
        const user_updated = await userRepository.updateById(id, { user_name: name })
        return user_updated
    }

    async deleteById(id) {
        // 1. Obtener todas las membresías del usuario
        const memberships = await memberWorkspaceRepository.getWorkspaceListByUserId(id)

        if (memberships && memberships.length > 0) {
            for (const mw of memberships) {
                await memberWorkspaceService.delete(mw.workspace_id, mw.member_id)
            }
        }

        // 2. Eliminar el usuario definitivamente
        const user_deleted = await userRepository.deleteById(id)
        return user_deleted
    }
}

const userService = new UserService()

export default userService