/**
 * @fileoverview Repositorio para la gestión de usuarios.
 * Contiene la clase encargada de interactuar con la base de datos para la colección de Usuarios.
 */

import User from "../models/user.model.js";
import { repositoryErrorHandler } from "../middlewares/errorHandler.js";

/**
 * @class UserRepository
 * @description Clase que expone los diferentes métodos para realizar operaciones CRUD y consultas específicas sobre usuarios.
 */
class UserRepository {

    /**
     * @async
     * @function create
     * @description Crea un nuevo usuario en la base de datos.
     * @param {string} user_name - El nombre del usuario.
     * @param {string} password - La contraseña encriptada del usuario.
     * @param {string} email - El correo electrónico del usuario.
     * @returns {Promise<void>}
     */
    async create(user_name, password, email) {
        try {
            await User.create({
                user_name: user_name,
                password: password,
                email: email
            })
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function deleteById
     * @description Elimina un usuario por su ID de forma física.
     * @param {string} id - ID del usuario a eliminar.
     * @returns {Promise<void>}
     */
    async deleteById(id) {
        try {
            await User.findByIdAndDelete(id)
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function getById
     * @description Obtiene el registro de un usuario mediante su ID.
     * @param {string} id - ID del usuario.
     * @returns {Promise<Object>} Documento del usuario encontrado.
     */
    async getById(id) {
        try {
            return await User.findById(id)
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function updateById
     * @description Actualiza las propiedades de un usuario mediante su ID.
     * @param {string} id - El ID del usuario a modificar.
     * @param {Object} update_data - Objeto con las propiedades a modificar.
     * @returns {Promise<Object>} El documento del usuario una vez aplicado el cambio.
     */
    async updateById(id, update_data) {
        try {
            const user_updated = await User.findByIdAndUpdate(id, update_data, { new: true })

            return user_updated
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function getByEmail
     * @description Obtiene a un usuario basándose en su correo electrónico.
     * @param {string} email - El email del usuario a buscar.
     * @returns {Promise<Object>} El documento del usuario.
     */
    async getByEmail(email) {
        try {
            const user = await User.findOne({ email: email })
            return user
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function getUser
     * @description Obtiene un solo usuario cualquiera de la colección (útil para validaciones o casos de prueba rápidos).
     * @returns {Promise<Object>} El primer documento de usuario encontrado.
     */
    async getUser() {
        try {
            const user = await User.findOne()
            return user
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

    /**
     * @async
     * @function getUserByEmailAndPassword
     * @description Obtiene un usuario buscando por sus credenciales combinadas (email y contraseña).
     * @param {string} email - Correo del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<Object>} El usuario que coincida exactamente con las credenciales dadas.
     */
    async getUserByEmailAndPassword(email, password) {
        try {
            const user = await User.findOne({ email: email, password: password })
            return user
        } catch (error) {
            repositoryErrorHandler(error)
        }
    }

}

/**
 * @constant {UserRepository} userRepository
 * @description Instancia del repositorio de usuarios predeterminada, lista para su uso.
 */
const userRepository = new UserRepository()
export default userRepository
