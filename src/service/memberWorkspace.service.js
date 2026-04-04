import ServerError from "../helper/serverError.helper.js";
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";
import workspaceService from "./workspace.service.js";

class MemberWorkspaceService {
    async getWorkspaces(user_id) {
        //traer la lista de espacios de trabajo relacionados a el usuario logueado
        const workspacesList = await memberWorkspaceRepository.getWorkspaceListByUserId(user_id)
        console.log("Workspaces List: ", workspacesList)
        return workspacesList
    }

    async create(workspace_id, user_id, role) {
        const result = await memberWorkspaceRepository.getUserByWorkspaceIdAndUserId(workspace_id, user_id)
        if (result.length > 0) {
            throw new ServerError('El usuario ya existe en este espacio de trabajo', 400)
        }

        await memberWorkspaceRepository.create(workspace_id, user_id, role)
    }

}

const memberWorkspaceService = new MemberWorkspaceService()
export default memberWorkspaceService