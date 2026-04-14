import ServerError from "../helper/serverError.helper.js"
import messageChannelRepository from "../repository/messageChannel.repository.js"

class MessagesChannelWorkspaceService {
    async create(content, id_member, id_channel) {
        if (!content) {
            throw new ServerError('El contenido es requerido', 400)
        }
        if (!id_member) {
            throw new ServerError('El id del miembro es requerido', 400)
        }
        if (!id_channel) {
            throw new ServerError('El id del canal es requerido', 400)
        }

        const message = await messageChannelRepository.create(content, id_member, id_channel)
        return message
    }

    async getMessages(id_channel) {
        if (!id_channel) {
            throw new ServerError('El id del canal es requerido', 400)
        }

        const messages = await messageChannelRepository.getByChannelId(id_channel)
        return messages
    }

    async deleteMessage(id) {
        if (!id) {
            throw new ServerError('El id del mensaje es requerido', 400)
        }

        const message = await messageChannelRepository.deleteById(id)
        return message
    }

    async deleteMessageLogic(id) {
        if (!id) {
            throw new ServerError('El id del mensaje es requerido', 400)
        }

        const message = await messageChannelRepository.deleteMessageLogic(id)
        return message
    }
}

const messagesChannelWorkspaceService = new MessagesChannelWorkspaceService()
export default messagesChannelWorkspaceService