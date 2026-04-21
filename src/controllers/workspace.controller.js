import ServerError from "../helper/serverError.helper.js"
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js"
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
            const { title, description } = request.body
            const user = request.user
            let url_image = ''

            if (request.file) {
                // Con CloudinaryStorage, request.file.path ya contiene la URL completa
                url_image = request.file.path
            }

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

    async getWorkspacebyId(request, response, next) {
        const workspace_id = request.params.workspace_id
        const user_id = request.user.id

        try {
            const workspace = await workspaceService.getById(workspace_id, user_id)
            const members = await memberWorkspaceRepository.getMemberList(workspace_id)
            return response.status(200).json({
                message: "Workspace obtenido correctamente",
                ok: true,
                status: 200,
                data: {
                    workspace: workspace,
                    members: members
                }
            })
        } catch (error) {
            next(error)
            console.error("Error al obtener el workspace: ", error)
        }
    }

    async updateById(request, response, next) {
        try {
            const workspace_id = request.params.workspace_id
            const { title, description } = request.body
            let url_image = request.body.url_image

            if (request.file) {
                url_image = request.file.path
            }

            const workspace_updated = await workspaceService.updateById(workspace_id, title, description, url_image)

            return response.status(200).json(
                {
                    message: 'Workspace actualizado exitosamente',
                    status: 200,
                    ok: true,
                    data: {
                        workspace_updated: workspace_updated
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async deleteById(request, response, next) {
        try {
            const workspace_id = request.params.workspace_id
            const workspace_deleted = await workspaceService.deleteById(workspace_id)
            return response.status(200).json(
                {
                    message: 'Workspace eliminado exitosamente',
                    status: 200,
                    ok: true,
                    data: {
                        workspace_deleted: workspace_deleted
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }
}

const workspacesController = new WorkspacesController()
export default workspacesController