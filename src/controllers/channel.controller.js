import ServerError from "../helper/serverError.helper.js"
import channelWorkspaceRepository from "../repository/channelWorkspace.repository.js"
import channelWorkspaceService from "../service/channelWorkspace.service.js"

class ChannelController {
    async getAll(request, response, next) {
        const workspace_id = request.params.workspace_id
        try {
            const channels = await channelWorkspaceService.getAll(workspace_id)
            if (!channels) {
                throw new ServerError('No se encontraron canales', 404)
            }
            return response.status(200).json(
                {
                    message: 'Canales obtenidos correctamente',
                    status: 200,
                    ok: true,
                    data: {
                        channels: channels
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async create(request, response, next) {
        try {
            const { title, description } = request.body
            const workspace_id = request.params.workspace_id

            if (!title) {
                throw new ServerError('El nombre del canal es obligatorio', 400)
            }

            if (!workspace_id) {
                throw new ServerError('El espacio de trabajo no existe', 404)
            }

            const channel_created = await channelWorkspaceService.create(title, description, workspace_id)

            if (!channel_created) {
                throw new ServerError('No se pudo crear el canal', 500)
            }

            return response.status(201).json(
                {
                    message: 'Canal creado correctamente',
                    status: 201,
                    ok: true,
                    data: {
                        channel: channel_created
                    }
                }
            )

        } catch (error) {
            next(error)
        }
    }
}

const channelController = new ChannelController()
export default channelController