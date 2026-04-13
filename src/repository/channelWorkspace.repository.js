/**
 * @fileoverview Repositorio para la gestión de canales de los espacios de trabajo.
 * Contiene la clase que encapsula las operaciones de base de datos utilizando el modelo ChannelWorkspace.
 */

import ChannelWorkspace from "../models/channelWorkspace.model.js";

/**
 * @class ChannelWorkspaceRepository
 * @description Clase que provee métodos para interactuar con la colección de canales en MongoDB.
 */
class ChannelWorkspaceRepository {
    /**
     * @async
     * @function create
     * @description Crea un nuevo canal en la base de datos.
     * @param {string} fk_id_workspace - ID del espacio de trabajo al que pertenece el canal.
     * @param {string} title - Título del canal.
     * @param {string} description - Descripción del canal.
     * @returns {Promise<void>}
     */
    async create(workspace_id, title, description) {
        const channel_created = await ChannelWorkspace.create({
            fk_id_workspace: workspace_id,
            title: title,
            description: description
        })
        return channel_created
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina un canal de la base de datos a partir de su ID.
     * @param {string} id - ID del canal a eliminar.
     * @returns {Promise<void>}
     */
    async deleteById(id) {
        await ChannelWorkspace.findByIdAndDelete(id)
    }

    /**
     * @async
     * @function getById
     * @description Obtiene un canal específico por su ID.
     * @param {string} id - ID del canal buscado.
     * @returns {Promise<Object>} El documento del canal encontrado.
     */
    async getById(channel_id) {
        const channel = await ChannelWorkspace.findById(channel_id)
        return channel
    }

    /**
     * @async
     * @function updateById
     * @description Actualiza los datos de un canal existente.
     * @param {Object} new_props - Objeto con las propiedades a actualizar, debe incluir el 'id' del canal.
     * @returns {Promise<Object>} El documento del canal con los datos actualizados.
     */
    async updateById(id, title, description) {
        const channel_updated = await ChannelWorkspace.findByIdAndUpdate(id, { title, description }, { new: true })
        return channel_updated
    }

    async getAll(workspace_id) {
        const channels = await ChannelWorkspace.find({ fk_id_workspace: workspace_id })
        return channels
    }

    async deleteLogic(id) {
        const channel_deleted = await ChannelWorkspace.findByIdAndUpdate(id, { is_active: false }, { new: true })
        return channel_deleted
    }
}

/**
 * @constant {ChannelWorkspaceRepository} channelWorkspaceRepository
 * @description Instancia del repositorio exportada por defecto para su uso en los servicios.
 */
const channelWorkspaceRepository = new ChannelWorkspaceRepository()
export default channelWorkspaceRepository