/**
 * @fileoverview Repositorio para la gestión de canales de los espacios de trabajo.
 * Contiene la clase que encapsula las operaciones de base de datos utilizando el modelo ChanellWorkspace.
 */

import ChanellWorkspace from "../models/chanellWorkspace.model.js";

/**
 * @class ChanellWorkspaceRepository
 * @description Clase que provee métodos para interactuar con la colección de canales en MongoDB.
 */
class ChanellWorkspaceRepository {
    /**
     * @async
     * @function create
     * @description Crea un nuevo canal en la base de datos.
     * @param {string} fk_id_workspace - ID del espacio de trabajo al que pertenece el canal.
     * @param {string} title - Título del canal.
     * @param {string} description - Descripción del canal.
     * @returns {Promise<void>}
     */
    async create(fk_id_workspace, title, description){
        await ChanellWorkspace.create({
            fk_id_workspace : fk_id_workspace,
            title : title,
            description:description
        })
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina un canal de la base de datos a partir de su ID.
     * @param {string} id - ID del canal a eliminar.
     * @returns {Promise<void>}
     */
    async deleteById(id){
        await ChanellWorkspace.findByIdAndDelete(id)
    }

    /**
     * @async
     * @function getById
     * @description Obtiene un canal específico por su ID.
     * @param {string} id - ID del canal buscado.
     * @returns {Promise<Object>} El documento del canal encontrado.
     */
    async getById(id){
        return await ChanellWorkspace.findById(id)
    }

    /**
     * @async
     * @function updateById
     * @description Actualiza los datos de un canal existente.
     * @param {Object} new_props - Objeto con las propiedades a actualizar, debe incluir el 'id' del canal.
     * @returns {Promise<Object>} El documento del canal con los datos actualizados.
     */
    async updateById(new_props){
        const new_chanellWorkspace = await ChanellWorkspace.findByIdAndUpdate(new_props.id, new_props, {new:true})

        return new_chanellWorkspace
    }
}

/**
 * @constant {ChanellWorkspaceRepository} chanellWorkspaceRepository
 * @description Instancia del repositorio exportada por defecto para su uso en los servicios.
 */
const chanellWorkspaceRepository = new ChanellWorkspaceRepository()
export default chanellWorkspaceRepository