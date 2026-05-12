import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspace from '../middlewares/verifyMemberWorkspaceMiddelware.js'
import messagesChannelWorkspaceController from '../controllers/messagesChannelWorkspace.controller.js'
import verifyChannelMiddleware from '../middlewares/verifyChannelMiddleware.js'
import upload from '../middlewares/upload.middleware.js'
const messagesChannelWorkspaceRouter = express.Router({ mergeParams: true })

messagesChannelWorkspaceRouter.post(
    '/message',
    authMiddleware,
    verifyChannelMiddleware,
    verifyMemberWorkspace([]),
    upload.single('file'),
    messagesChannelWorkspaceController.create
)

messagesChannelWorkspaceRouter.get(
    '/message',
    authMiddleware,
    verifyChannelMiddleware,
    verifyMemberWorkspace([]),
    messagesChannelWorkspaceController.getMessages
)

messagesChannelWorkspaceRouter.delete(
    '/message/:message_id',
    authMiddleware,
    verifyChannelMiddleware,
    verifyMemberWorkspace([]),
    messagesChannelWorkspaceController.deleteMessage
)

export default messagesChannelWorkspaceRouter





