import ServerError from "../helper/serverError.helper.js"
import channelWorkspaceRepository from "../repository/channelWorkspace.repository.js"

class ChannelWorkspaceService {
    async getAll(workspace_id) {

        const channels = await channelWorkspaceRepository.getAll(workspace_id)
        if (!channels) {
            throw new ServerError('No se encontraron canales', 404)
        }
        return channels
    }

    async create(title, description, workspace_id) {
        const channel_created = await channelWorkspaceRepository.create(workspace_id, title, description)
        return channel_created
    }

    async updateById(id, title, description) {
        if (!title) {
            throw new ServerError('El titulo es requerido', 400)
        }
        if (!description) {
            throw new ServerError('La description es requerida', 400)
        }
        const channel_updated = await channelWorkspaceRepository.updateById(id, title, description)
        return channel_updated
    }

    async deletById(id) {
        const channel_deleted = await channelWorkspaceRepository.deleteById(id)
        return channel_deleted
    }

    async deletLogic(id) {
        const channel_deleted = await channelWorkspaceRepository.deleteLogic(id)
        return channel_deleted
    }
}

const channelWorkspaceService = new ChannelWorkspaceService()
export default channelWorkspaceService