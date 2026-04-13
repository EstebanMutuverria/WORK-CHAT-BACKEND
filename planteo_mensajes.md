## Mensajes
POST /api/workspace/:workspace_id/channel/:channel_id/message
    Solo un miembro del espacio de trabajo puede crear un mensaje
    body: {
        content
    }

GET /api/workspace/:workspace_id/channel/:channel_id/message
    Obtener lista de mensajes