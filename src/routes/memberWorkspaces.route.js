import express from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'
import AVILABLE_ROLES from '../constants/roles.constants.js'
const memberWorkspacesRouter = express.Router()

//Obtiene los espacios de trabajo del usuario logueado
memberWorkspacesRouter.get(
    '/',
    authMiddleware,
    workspaceController.getWorkspaces

)

//Crea un espacio de trabajo
memberWorkspacesRouter.post(
    '/',
    authMiddleware,
    workspaceController.createWorkspace
)

//Obtiene un espacio de trabajo por id para poder visualizarlo
memberWorkspacesRouter.get(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspace([]),
    workspaceController.getWorkspacebyId
)

//Elimina un miembro del espacio de trabajo
/* memberWorkspacesRouter.delete(
    '/workspace_id/member/:member_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.deleteMember
) */
//Elimina logicamnte un espacio de trabajo
/* memberWorkspacesRouter.put(
    '/:workspace_id/deleteLogic',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.deleteLogic
) */

//Elimina fisicamente un espacio de trabajo
/* memberWorkspacesRouter.delete(
    '/:workspace_id/deleteFisic',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.deleteFisic
) */

//Crea un miembro del espacio de trabajo
/* memberWorkspacesRouter.post(
    '/:workspace_id/member',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.createMember
) */

/* memberWorkspacesRouter.put(
    '/:workspace_id/member/:member_id/deleteLogic',
    authMiddleware,
    verifyMemberWorkspace,
    workspaceController.deleteLogicMember
) */

//Actualiza el rol de un miembro del espacio de trabajo
/* memberWorkspacesRouter.put(
    '/:workspace_id/member/:member_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.updateMemberById
)
*/

export default memberWorkspacesRouter