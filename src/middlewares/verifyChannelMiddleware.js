import ServerError from "../helper/serverError.helper.js"
import channelWorkspaceRepository from "../repository/channelWorkspace.repository.js"

async function verifyChannelMiddleware(request, response, next) {
    const channel_id = request.params.channel_id
    const workspace_id = request.params.workspace_id
    try {
        const channel = await channelWorkspaceRepository.getById(channel_id)
        if (!channel) {
            throw new ServerError('El canal no existe en el espacio de trabajo', 404)
        }
        if (channel.fk_id_workspace.toString() != workspace_id) {
            throw new ServerError('El canal no existe en el espacio de trabajo', 404)
        }
        //me guardo el channel para usarlo en el controlador
        request.channel = channel
        next()
    } catch (error) {
        next(error)
    }
}

export default verifyChannelMiddleware