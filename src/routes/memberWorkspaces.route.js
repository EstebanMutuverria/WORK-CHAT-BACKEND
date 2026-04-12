import express from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'
import AVILABLE_ROLES from '../constants/roles.constants.js'
const memberWorkspacesRouter = express.Router()

memberWorkspacesRouter.get(
    '/',
    authMiddleware,
    workspaceController.getWorkspaces

)

memberWorkspacesRouter.post(
    '/',
    authMiddleware,
    workspaceController.createWorkspace
)

memberWorkspacesRouter.get(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspace([]),
    workspaceController.getWorkspacebyId
)

/* memberWorkspacesRouter.put(
    '/:workspace_id/',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.updateMemberById
)

memberWorkspacesRouter.put(
    '/:workspace_id/deleteLogic',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.deleteMemberLogic
)

memberWorkspacesRouter.delete(
    '/:workspace_id/deleteFisic',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    workspaceController.deleteFisic
) */

export default memberWorkspacesRouter