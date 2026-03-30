/**
 * @fileoverview Controlador para chequear el estado de salud de la API y la conexión a la base de datos.
 */

import userRepository from "../repository/user.repository.js"

/**
 * @class HealthController
 * @description Clase que provee métodos (endpoints) básicos para verificar la disponibilidad del sistema.
 */
class HealthController{
    /**
     * @function getApi
     * @description Endpoint simple que responde inmediatamente para confirmar que el servidor de la API está levantado.
     * @param {Object} request - Objeto de petición HTTP de Express.
     * @param {Object} response - Objeto de respuesta HTTP de Express.
     */
    getApi(request, response){
        response.status(200).json(
            {
                message: 'Api is alive',
                status: 200,
                ok: true
            }
        )
    }

    /**
     * @async
     * @function getDB
     * @description Endpoint que realiza una petición de solo lectura a la base de datos para asegurar su conexión.
     * @param {Object} request - Objeto de petición HTTP de Express.
     * @param {Object} response - Objeto de respuesta HTTP de Express.
     * @returns {Promise<Object>} Promesa que resuelve en la respuesta JSON informando el estado.
     */
    async getDB(request, response) {
        try {
            await userRepository.getUser()
            return response.status(200).json(
                {
                    message: 'Database is alive and is working correctly',
                    status: 200,
                    ok: true
                }
            )
        } catch (error) {
            return response.status(500).json(
                {
                    message: 'Database is not working correctly',
                    status: 500,
                    ok: false
                }
            )
        }
    }
}

/**
 * @constant {HealthController} healthController
 * @description Instancia del controlador exportada por defecto.
 */
const healthController = new HealthController()
export default healthController