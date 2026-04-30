/**
 * @fileoverview Definición de las rutas relacionadas con los Usuarios.
 */

import express from 'express'
import userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

/**
 * @route PUT /api/users/:user_id
 * @description Actualiza la información de un usuario por su ID.
 * @access Private
 */
userRouter.put(
    '/:user_id',
    authMiddleware,
    userController.updateById
)

/**
 * @route DELETE /api/users/:user_id
 * @description Elimina un usuario por su ID.
 * @access Private
 */
userRouter.delete(
    '/:user_id',
    authMiddleware,
    userController.deleteById
)


export default userRouter