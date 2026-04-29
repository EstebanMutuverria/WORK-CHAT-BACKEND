import express from 'express'
import userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.put(
    '/:user_id',
    authMiddleware,
    userController.updateById
)

userRouter.delete(
    '/:user_id',
    authMiddleware,
    userController.deleteById
)


export default userRouter