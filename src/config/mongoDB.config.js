/**
 * @fileoverview Configuración y conexión a la base de datos MongoDB.
 */

import mongoose from "mongoose"
import ENVIRONMENT from "./environment.config.js"

/**
 * @async
 * @function connectMongoDB
 * @description Establece la conexión con la base de datos MongoDB utilizando la cadena de conexión definida en las variables de entorno.
 * @returns {Promise<void>} Promesa que se resuelve cuando la base de datos se conecta correctamente.
 * En caso de error, captura la excepción y la imprime en consola.
 */
export async function connectMongoDB(){
    try {
        await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING)
        console.log('connected to mongoDB')
    } catch (error) {
        console.error("Not connected to mongoDB", error)
    }
}
