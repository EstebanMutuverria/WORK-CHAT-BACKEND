import ServerError from "../helper/serverError.helper.js";
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title || !description) {
            throw new ServerError('Título y descripción son obligatorios', 400)
        }
        const workspace_created = await workspaceRepository.create(title, description, url_image)
        await memberWorkspaceService.create(
            workspace_created._id,
            user_id,
            'owner'
        )
        return workspace_created
    }

    async getById(workspace_id, user_id) {
        const workspace = await memberWorkspaceRepository.getWorkspaceByUserAndWorkspaceId(workspace_id, user_id)
        if (!workspace || !user_id) {
            throw new ServerError('No tienes permiso para acceder a este workspace', 403)
        }
        return workspace
    }

}
const workspaceService = new WorkspaceService()
export default workspaceService