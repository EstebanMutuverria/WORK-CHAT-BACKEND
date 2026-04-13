## Miembros

POST /api/workspace/:workspace_id/member
Crear un miembro
body: {
    email: email del invitado,
    role: 'user' | 'admin'
}
OPCIONAL (Recomendada): 
    Que sea una invitacion (que el usuario pueda aceptar o declinar) y en caso de aceptar pueda entrar

    POST /api/workspace/:workspace_id/member/invite
    Crean el miembro como invitado (acceptInvitation: 'pending', 'accepted', 'rejected') y enviamos un mail con 2 links (cada uno con su token y la accion aceptar o rechazar) al usuario invitado.
    Si el usuario da click en el link que tiene el token enviara un get al backend donde se pasara el acceptInvitation a 'accepted' o 'rejected'.
    body: {
        email: email del invitado,
        role: 'user' | 'admin'
    }

    GET /api/workspace/:workspace_id/member/?token=ey
    dentro del token estara el action con 'accepted' o 'rejected'
    Revisar si el miembro esta en pendiente, si esta en algo DISTINTO A PENDIENTE NO DEJAR QUE LA ACCION CAMBIE AL MIEMBRO, debido a que este ya tomo una decision.

DELETE /api/workspace/:workspace_id/member/:member_id 
    Solo debe poder eliminar el dueño, administrador el mismo usuario
    Un administrador NO puede eliminar a un dueño

PUT /api/workspace/:workspace_id/member/:member_id 
    Solo admins y dueños pueden actualizar el role de otros miembros, excepto el suyo. 
    Admin no puede actualizar a dueño
    NO se puede actualizar a 'owner'
    body: {
        role: 'admin' | 'user'
    }

GET /api/workspace/:workspace_id/member
    Obtener lista de miembros