import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import workspacesController from '../controllers/workspace.controller.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'

const workspacesRouter = express.Router()

//Crea un espacio de trabajo.
workspacesRouter.post(
    '/',
    authMiddleware,
    workspacesController.createWorkspace
)

//Obtiene la lista de los espacios de trabajo 
workspacesRouter.get(
    '/',
    authMiddleware,
    workspacesController.getWorkspaces
)

//Obtine un espacio de trabajo por su ID para poder tener la vista de este espacio de trabajo y sus miembros. 
workspacesRouter.get(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspace([]),
    workspacesController.getWorkspacebyId
)

/* //Elimina un espacio de trabajo de forma logica
workspacesRouter.put(
    '/:workspace_id/deleteLogic',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.deleteLogic
)

//Elimina fisicamente un espacio de trabajo
workspacesRouter.delete(
    '/:workspace_id/deleteFisic',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.deleteFisic
) */




export default workspacesRouter
