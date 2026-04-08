## Canales
## Backend

POST /api/workspace/:workspace_id/channel
Middlewares: 
    - auth
    - verifyMember (Configurar rol si se desea)
    - verifyWorkspaceMiddleware
body: {
    title,
    description
}

GET /api/workspace/:workspace_id/channel
Middlewares: 
    - auth
    - verifyMember (Configurar rol si se desea)
    - verifyWorkspaceMiddleware

DELETE /api/workspace/:workspace_id/channel/:channel_id
Middlewares: 
    - auth
    - verifyMember (Configurar rol si se desea)
    - verifyWorkspaceMiddleware
    - verifyChannelMiddleware