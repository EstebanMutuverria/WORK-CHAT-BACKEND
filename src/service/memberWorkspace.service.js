import ServerError from "../helper/serverError.helper.js";
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";
import workspaceService from "./workspace.service.js";

class MemberWorkspaceService {
    async getWorkspaces(user_id) {
        //traer la lista de espacios de trabajo relacionados a el usuario logueado
        const workspacesList = await memberWorkspaceRepository.getWorkspaceListByUserId(user_id)

        return workspacesList
    }

    async create(workspace_id, user_id, role) {
        const result = memberWorkspaceRepository.getUserByWorkspaceIdAndUserId(user_id, workspace_id)
        if (result.lenght > 0) {
            throw new ServerError('El miembro ya existe en este espacio de trabajo')
        }

        await memberWorkspaceRepository.create(workspace_id, user_id, role)
    }

}

const memberWorkspaceService = new MemberWorkspaceService()
export default memberWorkspaceService