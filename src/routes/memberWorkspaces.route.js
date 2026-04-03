import express from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
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

export default memberWorkspacesRouter