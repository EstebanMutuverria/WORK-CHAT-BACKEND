/**
 * @fileoverview Definición de las rutas para verificar el estado de la API.
 * Asocia los endpoints de '/api/health' a los métodos del HealthController.
 */

import express from 'express'
import healthController from '../controllers/health.controller.js'

const healthRouter = express.Router()

/**
 * @route GET /api/health/
 * @description Endpoint para chequear que la aplicación principal se encuentra ejecutándose y disponible.
 * @access Public
 */
healthRouter.get(
    '/',
    healthController.getApi
)

/**
 * @route GET /api/health/database
 * @description Endpoint para verificar el estado de conexión a la base de datos de MongoDB.
 * @access Public
 */
healthRouter.get(
    '/database',
    healthController.getDB
)

export default healthRouter