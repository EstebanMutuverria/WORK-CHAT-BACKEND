/**
 * @fileoverview Repositorio para la gestión de mensajes de canales.
 * Contiene la clase encargada de realizar las operaciones sobre la colección de mensajes en MongoDB.
 */

import MessageChannel from "../models/messageChannel.model.js";

/**
 * @class MessageChannelRepository
 * @description Clase que provee métodos para crear, obtener, actualizar y eliminar mensajes de los canales.
 */
class MessageChannelRepository {
    /**
     * @async
     * @function create
     * @description Crea y almacena un nuevo mensaje en la base de datos.
     * @param {string} content - El contenido del mensaje.
     * @param {string} fk_id_member - ID del miembro que envía el mensaje.
     * @param {string} fk_id_channel - ID del canal donde se envía.
     * @returns {Promise<void>}
     */
    async create(content, fk_id_member, fk_id_channel) {
        const message = await MessageChannel.create({
            content: content,
            fk_id_member: fk_id_member,
            fk_id_channel: fk_id_channel
        })
        return message
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina un mensaje específico utilizando su ID.
     * @param {string} id - ID del mensaje a borrar.
     * @returns {Promise<void>}
     */
    async deleteById(id) {
        await MessageChannel.findByIdAndDelete(id)
    }

    /**
     * @async
     * @function getById
     * @description Obtiene un mensaje por su ID.
     * @param {string} id - ID del mensaje buscado.
     * @returns {Promise<Object>} El documento del mensaje.
     */
    async getById(id) {
        return await MessageChannel.findById(id)
    }

    /**
     * @async
     * @function updateById
     * @description Modifica el contenido u otras propiedades de un mensaje existente.
     * @param {Object} new_props - Objeto con los nuevos valores. Debe incluir la propiedad 'id'.
     * @returns {Promise<Object>} El documento del mensaje modificado.
     */
    async updateById(new_props) {
        const new_messageChannel = await MessageChannel.findByIdAndUpdate(new_props.id, new_props, { new: true })

        return new_messageChannel
    }

    async getByChannelId(id_channel) {
        const messages = await MessageChannel.find({ fk_id_channel: id_channel })
        return messages
    }
}

/**
 * @constant {MessageChannelRepository} messageChannelRepository
 * @description Instancia del repositorio de mensajes exportada por defecto para su uso en toda la app.
 */
const messageChannelRepository = new MessageChannelRepository()
export default messageChannelRepository