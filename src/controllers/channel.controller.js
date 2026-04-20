import { isValidObjectId } from "mongoose"
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

            const channel_created = await channelWorkspaceService.create(title, description, workspace_id)

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

    async updateById(request, response, next) {
        try {
            const { title, description } = request.body
            const workspace_id = request.params.workspace_id
            const channel_id = request.params.channel_id

            if (!isValidObjectId(workspace_id)) {
                throw new ServerError('El espacio de trabajo no es valido', 403)
            }
            if (!isValidObjectId(channel_id)) {
                throw new ServerError('El canal no es valido', 403)
            }
            const channel_updated = await channelWorkspaceService.updateById(channel_id, title, description)
            if (!channel_updated) {
                throw new ServerError('No se pudo actualizar el canal', 500)
            }
            return response.status(200).json(
                {
                    message: 'Canal actualizado correctamente',
                    status: 200,
                    ok: true,
                    data: {
                        channel: channel_updated
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
            const channel_id = request.params.channel_id

            if (!isValidObjectId(workspace_id)) {
                throw new ServerError('El espacio de trabajo no es valido', 403)
            }

            if (!isValidObjectId(channel_id)) {
                throw new ServerError('El canal no es valido', 403);

            }
            const channel_deleted = await channelWorkspaceService.deleteById(channel_id)
            return response.status(200).json(
                {
                    message: 'Canal eliminado exitosamente',
                    ok: true,
                    status: 200,
                    data: {
                        channel_deleted: channel_deleted
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async deleteLogic(request, response, next) {
        try {
            const workspace_id = request.params.workspace_id
            const channel_id = request.params.channel_id

            if (!isValidObjectId(workspace_id)) {
                throw new ServerError('El espacio de trabajo no es valido', 403)
            }

            if (!isValidObjectId(channel_id)) {
                throw new ServerError('El canal no es valido', 403)
            }

            const channel_deleted = await channelWorkspaceRepository.deleteLogic(channel_id)
            return response.status(200).json(
                {
                    message: "Canal eliminado exitosamente",
                    ok: true,
                    status: 200,
                    data: {
                        channel_deleted: channel_deleted
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