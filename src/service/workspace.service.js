import ServerError from "../helper/serverError.helper.js";
import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title || !description || !url_image) {
            throw new ServerError('Todos los campos son obligatorios', 400)
        }
        const workspace_created = await workspaceRepository.create(title, description, url_image)
        await memberWorkspaceService.create(
            workspace_created._id,
            user_id,
            'owner'
        )
        return workspace_created
    }

}
const workspaceService = new WorkspaceService()
export default workspaceService