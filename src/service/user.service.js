import ServerError from "../helper/serverError.helper.js"
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js"
import userRepository from "../repository/user.repository.js"
import AVILABLE_ROLES from "../constants/roles.constants.js"
import workspaceService from "./workspace.service.js"
import memberWorkspaceService from "./memberWorkspace.service.js"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.config.js"

class UserService {
    async updateById(id, name) {
        if (!name) {
            throw new ServerError('El nombre es requerido', 400)
        }
        const user_updated = await userRepository.updateById(id, { user_name: name })
        
        if (!user_updated) {
            throw new ServerError('Usuario no encontrado', 404)
        }

        // Generar un nuevo token con el nombre actualizado
        const auth_token = jwt.sign(
            {
                email: user_updated.email,
                name: user_updated.user_name,
                created_at: user_updated.created_at,
                id: user_updated._id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )

        return {
            user: user_updated,
            auth_token
        }
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