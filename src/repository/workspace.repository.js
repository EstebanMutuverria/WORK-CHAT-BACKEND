/**
 * @fileoverview Repositorio para la gestión de los espacios de trabajo.
 * Contiene la clase que hace de intermediario entre la base de datos (MongoDB) y la lógica de negocio para los Workspaces.
 */

import Workspace from "../models/workspace.model.js"

/**
 * @class WorkspaceRepository
 * @description Clase que provee métodos asíncronos para operaciones CRUD y peticiones de espacios de trabajo.
 */
class WorkspaceRepository {
    /**
     * @async
     * @function create
     * @description Crea un nuevo espacio de trabajo en la DB.
     * @param {string} title - Título que tendrá el espacio de trabajo.
     * @param {string} description - Descripción sobre este espacio.
     * @param {string} url_image - URL de la imagen de portada o icono de este espacio.
     * @returns {Promise<void>}
     */
    async create(title, description, url_image) {
        const workspace_created = await Workspace.create({
            title: title,
            description: description,
            url_image: url_image
        })
        return workspace_created
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina el espacio de trabajo que corresponda al ID ingresado.
     * @param {string} id - ID del espacio de trabajo.
     * @returns {Promise<void>}
     */
    async deleteById(id) {
        await Workspace.findByIdAndDelete(id)
    }

    /**
     * @async
     * @function getById
     * @description Consulta la base de datos para obtener un documento de espacio de trabajo mediante su ID.
     * @param {string} id - ID del espacio de trabajo.
     * @returns {Promise<Object>} El documento del espacio de trabajo hallado.
     */
    async getById(id) {
        return await Workspace.findById(id)
    }

    /**
     * @async
     * @function updateById
     * @description Actualiza los datos que contenga un Workspace particular.
     * @param {Object} new_props - Objeto de valores a actualizar. Debe traer integrado el ID de dicho espacio bajo 'id'.
     * @returns {Promise<Object>} El espacio de trabajo actualizado.
     */
    async updateById(new_props) {
        const new_workspace = await Workspace.findByIdAndUpdate(new_props.id, new_props, { new: true })

        return new_workspace
    }
}

/**
 * @constant {WorkspaceRepository} workspaceRepository
 * @description Instancia exportada del repositorio de Workspace.
 */
const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository
