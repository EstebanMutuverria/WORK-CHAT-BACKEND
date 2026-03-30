import ServerError from "../helper/serverError.helper.js"
import memberWorkspaceService from "../service/memberWorkspace.service.js"

class WorkspacesController {
    async getWorkspaces(request, response) {
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
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                return response.status(500).json({
                    message: "Error interno",
                    ok: false,
                    status: 500
                })
            }
        }
    }
}

const workspacesController = new WorkspacesController()
export default workspacesController