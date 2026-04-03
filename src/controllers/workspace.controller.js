import memberWorkspaceService from "../service/memberWorkspace.service.js"
import workspaceService from "../service/workspace.service.js"

class WorkspacesController {
    async getWorkspaces(request, response, next) {
        try {
            //Cliente consultante
            const user_id = request.user.id

            //traer la lista de espacios de trabajo relacionados a el usuario logueado
            const workspacesList = await memberWorkspaceService.getWorkspaces(user_id)

            return response.status(200).json({
                message: "Workspaces obtenidos correctamente",
                ok: true,
                status: 200,
                data: { workspacesList }
            })


        } catch (error) {
            next(error)
        }
    }

    async createWorkspace(request, response, next) {
        try {
            const { title, description, url_image } = request.body
            const user = request.user

            const workspace_created = await workspaceService.create(title, description, url_image, user.id)

            return response.status(201).json({
                message: "Workspace creado correctamente",
                ok: true,
                status: 201,
                data: { workspace_created }
            })
        } catch (error) {
            next(error)
        }
    }
}

const workspacesController = new WorkspacesController()
export default workspacesController