import express from 'express'
import memberWorkspaceController from '../controllers/memberWorkspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'
import AVILABLE_ROLES from '../constants/roles.constants.js'

const memberWorkspacesRouter = express.Router({ mergeParams: true })

/**
 * @route POST /api/workspaces/:workspace_id/members/invite
 * @description Invitar a un usuario a un espacio de trabajo. Solo accesible por OWNER y ADMIN.
 */
memberWorkspacesRouter.post(
    '/invite',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    memberWorkspaceController.inviteMember
)

/**
 * @route GET /api/workspaces/:workspace_id/members
 * @description Procesar la respuesta a una invitación (aceptar/rechazar).
 */
memberWorkspacesRouter.get(
    '/',
    memberWorkspaceController.respondToInvitation
)

memberWorkspacesRouter.delete(
    '/:member_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    memberWorkspaceController.delete
)

memberWorkspacesRouter.put(
    '/:member_id',
    authMiddleware,
    verifyMemberWorkspace([AVILABLE_ROLES.OWNER, AVILABLE_ROLES.ADMIN]),
    memberWorkspaceController.updateRole
)


export default memberWorkspacesRouter
