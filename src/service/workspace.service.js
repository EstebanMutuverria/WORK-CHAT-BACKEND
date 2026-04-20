import ServerError from "../helper/serverError.helper.js";
import channelWorkspaceRepository from "../repository/channelWorkspace.repository.js";
import memberWorkspaceRepository from "../repository/memberWorkspace.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title || !description) {
            throw new ServerError('Título y descripción son obligatorios', 400)
        }
        const workspace_created = await workspaceRepository.create(title, description, url_image)
        await memberWorkspaceService.create(
            workspace_created._id,
            user_id,
            'owner'
        )
        return workspace_created
    }

    async getById(workspace_id, user_id) {
        const workspace = await memberWorkspaceRepository.getWorkspaceByUserAndWorkspaceId(workspace_id, user_id)
        if (!workspace || !user_id) {
            throw new ServerError('No tienes permiso para acceder a este workspace', 403)
        }
        return workspace
    }

    async updateById(workspace_id, title, description, url_image) {
        if (!title) {
            throw new ServerError('El título es obligatorio', 400)
        }
        if (!description) {
            throw new ServerError('La descripción es obligatoria', 400)
        }
        if (!url_image) {
            throw new ServerError('Debe seleccionar una imagen', 400)
        }
        const workspace_updated = await workspaceRepository.updateById(workspace_id, title, description, url_image)
        if (!workspace_updated) {
            throw new ServerError('No fue posible actualizar el espacio de trabajo', 403)
        }

        return workspace_updated
    }

    async deleteById(workspace_id) {
        if (!workspace_id) {
            throw new ServerError('Ningún espacio de trabajo fue seleccionado.', 400)
        }

        // 1. Eliminar el workspace físicamente
        const workspace_deleted = await workspaceRepository.deleteById(workspace_id)

        if (!workspace_deleted) {
            // Si no se encontró, lanzamos 404 en lugar de 403 para ser más precisos
            throw new ServerError('No fue posible eliminar el espacio de trabajo. El ID no existe.', 404)
        }

        // 2. Eliminación en cascada: Borrar miembros asociados
        await memberWorkspaceRepository.deleteByWorkspaceId(workspace_id)

        // 3. Eliminación en cascada: Borrar canales asociados
        await channelWorkspaceRepository.deleteByWorkspaceId(workspace_id)

        return workspace_deleted
    }
}
const workspaceService = new WorkspaceService()
export default workspaceService