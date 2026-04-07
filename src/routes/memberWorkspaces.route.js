import express from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'
const memberWorkspacesRouter = express.Router()

memberWorkspacesRouter.get
    (
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

export default memberWorkspacesRouter