import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'
import verifyChannelMiddleware from '../middlewares/verifyChannelMiddleware.js'
import channelController from '../controllers/channel.controller.js'
import AVILABLE_ROLES from '../constants/roles.constants.js'
const channelWorkspaceRouter = express.Router({ mergeParams: true })

//Crear un canal
channelWorkspaceRouter.post(
    '/',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    channelController.create
)

//Obtener todos los canales
channelWorkspaceRouter.get(
    '/',
    authMiddleware,
    verifyMemberWorkspace([]),
    channelController.getAll
)

//Eliminar un canal
channelWorkspaceRouter.delete(
    '/:channel_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    verifyChannelMiddleware,
    channelController.deleteById
)

//Actualizar un canal
channelWorkspaceRouter.put(
    '/:channel_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    verifyChannelMiddleware,
    channelController.updateById
)

//Eliminar logico de un canal
channelWorkspaceRouter.put(
    '/:channel_id/logicDelete',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    verifyChannelMiddleware,
    channelController.deleteLogic
)



export default channelWorkspaceRouter
