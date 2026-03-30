/**
 * @fileoverview Repositorio para la gestión de mensajes de canales.
 * Contiene la clase encargada de realizar las operaciones sobre la colección de mensajes en MongoDB.
 */

import MessageChanell from "../models/messageChanell.model.js";

/**
 * @class MessageChanellRepository
 * @description Clase que provee métodos para crear, obtener, actualizar y eliminar mensajes de los canales.
 */
class MessageChanellRepository {
    /**
     * @async
     * @function create
     * @description Crea y almacena un nuevo mensaje en la base de datos.
     * @param {string} content - El contenido del mensaje.
     * @param {string} fk_id_member - ID del miembro que envía el mensaje.
     * @param {string} fk_id_chanell - ID del canal donde se envía.
     * @returns {Promise<void>}
     */
    async create(content, fk_id_member, fk_id_chanell){
        await MessageChanell.create({
            content : content,
            fk_id_member : fk_id_member,
            fk_id_chanell : fk_id_chanell
        })
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina un mensaje específico utilizando su ID.
     * @param {string} id - ID del mensaje a borrar.
     * @returns {Promise<void>}
     */
    async deleteById(id){
        await MessageChanell.findByIdAndDelete(id)
    }

    /**
     * @async
     * @function getById
     * @description Obtiene un mensaje por su ID.
     * @param {string} id - ID del mensaje buscado.
     * @returns {Promise<Object>} El documento del mensaje.
     */
    async getById(id){
        return await MessageChanell.findById(id)
    }

    /**
     * @async
     * @function updateById
     * @description Modifica el contenido u otras propiedades de un mensaje existente.
     * @param {Object} new_props - Objeto con los nuevos valores. Debe incluir la propiedad 'id'.
     * @returns {Promise<Object>} El documento del mensaje modificado.
     */
    async updateById(new_props){
        const new_messageChanell = await MessageChanell.findByIdAndUpdate(new_props.id, new_props, {new:true})

        return new_messageChanell
    }
}

/**
 * @constant {MessageChanellRepository} messageChanelRepository
 * @description Instancia del repositorio de mensajes exportada por defecto para su uso en toda la app.
 */
const messageChanelRepository = new MessageChanellRepository()
export default messageChanelRepository