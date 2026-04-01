import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";

class MemberWorkspaceService {
    async getWorkspaces(user_id) {
        //traer la lista de espacios de trabajo relacionados a el usuario logueado
        const workspacesList = await memberWorkspaceRepository.getWorkspaceListByUserId(user_id)

        return workspacesList
    }
}

const memberWorkspaceService = new MemberWorkspaceService()
export default memberWorkspaceService