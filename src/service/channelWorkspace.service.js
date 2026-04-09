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
}

const channelWorkspaceService = new ChannelWorkspaceService()
export default channelWorkspaceService