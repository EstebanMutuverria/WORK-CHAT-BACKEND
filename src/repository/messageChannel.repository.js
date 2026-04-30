/**
 * @fileoverview Repositorio para la gestión de mensajes de canales.
 * Contiene la clase encargada de realizar las operaciones sobre la colección de mensajes en MongoDB.
 */

import MessageChannel from "../models/messageChannel.model.js";
import { repositoryErrorHandler } from "../middlewares/errorHandler.js";
import channelWorkspaceRepository from "./channelWorkspace.repository.js";

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
     * @returns {Promise<Object>}
     */
    async create(content, fk_id_member, fk_id_channel) {
        try {
            const message = await MessageChannel.create({
                content: content,
                fk_id_member: fk_id_member,
                fk_id_channel: fk_id_channel
            })
            // Poblamos para que el frontend reciba la info del usuario inmediatamente por socket
            const populatedMessage = await MessageChannel.findById(message._id).populate({
                path: 'fk_id_member',
                populate: {
                    path: 'fk_id_user',
                    select: 'user_name'
                }
            })
            return populatedMessage
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina un mensaje específico utilizando su ID.
     * @param {string} id - ID del mensaje a borrar.
     * @returns {Promise<void>}
     */
    async deleteById(id) {
        try {
            await MessageChannel.findByIdAndDelete(id)
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function getById
     * @description Obtiene un mensaje por su ID.
     * @param {string} id - ID del mensaje buscado.
     * @returns {Promise<Object>} El documento del mensaje.
     */
    async getById(id) {
        try {
            return await MessageChannel.findById(id).populate('fk_id_member')
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function updateById
     * @description Modifica el contenido u otras propiedades de un mensaje existente.
     * @param {Object} new_props - Objeto con los nuevos valores. Debe incluir la propiedad 'id'.
     * @returns {Promise<Object>} El documento del mensaje modificado.
     */
    async updateById(new_props) {
        try {
            const new_messageChannel = await MessageChannel.findByIdAndUpdate(new_props.id, new_props, { new: true })

            return new_messageChannel
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    async getByChannelId(id_channel) {
        try {
            const messages = await MessageChannel.find({ fk_id_channel: id_channel })
                .populate({
                    path: 'fk_id_member',
                    populate: {
                        path: 'fk_id_user',
                        select: 'user_name'
                    }
                })
            return messages
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    async deleteMessageLogic(id) {
        try {
            const message_deleted = await MessageChannel.findByIdAndUpdate(id, { is_active: false }, { new: true })
            return message_deleted
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    async deleteByChannelId(id_channel) {
        try {
            await MessageChannel.deleteMany({ fk_id_channel: id_channel })
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }
}

/**
 * @constant {MessageChannelRepository} messageChannelRepository
 * @description Instancia del repositorio de mensajes exportada por defecto para su uso en toda la app.
 */
const messageChannelRepository = new MessageChannelRepository()
export default messageChannelRepository