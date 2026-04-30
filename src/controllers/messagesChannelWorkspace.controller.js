import messagesChannelWorkspaceService from "../service/messagesChannelWorkspace.service.js"

class MessagesChannelWorkspaceController {
    async create(request, response, next) {
        try {
            const { content } = request.body
            const { workspace_id, channel_id } = request.params
            // El middleware verifyMemberWorkspace ya verificó que el usuario
            // pertenece al workspace y guardó el documento MemberWorkspace en request.member.
            // Usamos su _id como FK para que el populate funcione correctamente.
            const member_id = request.member._id

            if (!workspace_id) {
                throw new Error('No se envio el id del espacio de trabajo')
            }

            if (!member_id) {
                throw new Error('No se envio el id del miembro')
            }

            if (!channel_id) {
                throw new Error('No se envio el id del canal')
            }

            const message_created = await messagesChannelWorkspaceService.create(content, member_id, channel_id)
            
            return response.status(201).json({
                message: 'Mensaje creado correctamente',
                ok: true,
                data: {
                    message_created: message_created
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getMessages(request, response, next) {
        try {
            const channel_id = request.params.channel_id

            const messages = await messagesChannelWorkspaceService.getMessages(channel_id)
            return response.status(200).json({
                message: 'Mensajes obtenidos correctamente',
                ok: true,
                data: {
                    messages: messages
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteMessage(request, response, next) {
        try {
            const message_id = request.params.message_id
            const user_id = request.user.id

            const message_deleted = await messagesChannelWorkspaceService.deleteMessage(message_id, user_id)
            return response.status(200).json({
                message: 'Mensaje eliminado correctamente',
                ok: true,
                data: {
                    message_deleted: message_deleted
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteMessageLogic(request, response, next) {
        try {
            const { message_id } = request.params
            const message_deleted = await messagesChannelWorkspaceService.deleteMessageLogic(message_id)
            return response.status(200).json(
                {
                    message: 'Mensaje elminado exitosamente',
                    ok: true,
                    status: 200,
                    data: {
                        message_deleted: message_deleted
                    }
                }
            )

        } catch (error) {
            next(error)
        }
    }
}

const messagesChannelWorkspaceController = new MessagesChannelWorkspaceController()
export default messagesChannelWorkspaceController