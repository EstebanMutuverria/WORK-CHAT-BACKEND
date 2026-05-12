import ServerError from "../helper/serverError.helper.js"
import messageChannelRepository from "../repository/messageChannel.repository.js"

class MessagesChannelWorkspaceService {
    async create(content, id_member, id_channel, attachment = null) {
        if (!content && !attachment) {
            throw new ServerError('El contenido o un archivo es requerido', 400)
        }
        if (!id_member) {
            throw new ServerError('El id del miembro es requerido', 400)
        }
        if (!id_channel) {
            throw new ServerError('El id del canal es requerido', 400)
        }

        const message = await messageChannelRepository.create(content, id_member, id_channel, attachment)
        return message
    }

    async getMessages(id_channel) {
        if (!id_channel) {
            throw new ServerError('El id del canal es requerido', 400)
        }

        const messages = await messageChannelRepository.getByChannelId(id_channel)
        return messages
    }

    async deleteMessage(id, user_id) {
        if (!id) {
            throw new ServerError('El id del mensaje es requerido', 400)
        }

        const message = await messageChannelRepository.getById(id)
        if (!message) {
            throw new ServerError('No se encontro el mensaje', 404)
        }

        if (message.fk_id_member.fk_id_user.toString() !== user_id.toString()) {
            throw new ServerError('No tienes permisos para eliminar este mensaje', 403)
        }

        const messageDeleted = await messageChannelRepository.deleteById(id)
        return messageDeleted
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