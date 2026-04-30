/**
 * @fileoverview Definición de las rutas relacionadas con los Espacios de Trabajo (Workspaces).
 */

import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import workspacesController from '../controllers/workspace.controller.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'
import upload from '../middlewares/upload.middleware.js'
import AVILABLE_ROLES from '../constants/roles.constants.js'

const workspacesRouter = express.Router()

/**
 * @route POST /api/workspaces
 * @description Crea un nuevo espacio de trabajo.
 * @access Private
 */
workspacesRouter.post(
    '/',
    authMiddleware,
    upload.single('image'),
    workspacesController.createWorkspace
)

/**
 * @route GET /api/workspaces
 * @description Obtiene la lista de todos los espacios de trabajo donde el usuario es miembro.
 * @access Private
 */
workspacesRouter.get(
    '/',
    authMiddleware,
    workspacesController.getWorkspaces
)

/**
 * @route GET /api/workspaces/:workspace_id
 * @description Obtiene un espacio de trabajo por su ID para visualizar sus detalles y miembros.
 * @access Private
 */
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
    */

/**
 * @route DELETE /api/workspaces/:workspace_id
 * @description Elimina físicamente un espacio de trabajo (solo para OWNERs).
 * @access Private
 */
workspacesRouter.delete(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER]),
    workspacesController.deleteById
)

/**
 * @route PUT /api/workspaces/:workspace_id
 * @description Actualiza la información de un espacio de trabajo (solo para OWNERs).
 * @access Private
 */
workspacesRouter.put(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER]),
    upload.single('image'),
    workspacesController.updateById
)




export default workspacesRouter
