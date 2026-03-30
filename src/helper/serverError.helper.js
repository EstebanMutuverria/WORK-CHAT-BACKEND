/**
 * @fileoverview Helper para el manejo de errores del servidor.
 * Define una clase de error personalizada para incluir códigos de estado HTTP con el mensaje.
 */

/**
 * @class ServerError
 * @extends Error
 * @description Clase personalizada para representar errores del servidor con un código de estado HTTP específico.
 */
class ServerError extends Error{
    /**
     * @constructor
     * @param {string} message - Mensaje descriptivo del error a lanzar.
     * @param {number} status - Código de estado HTTP asocidado al error (ej. 400, 404, 500).
     */
    constructor(message,status){
        super(message)
        this.status = status
    }
}

export default ServerError