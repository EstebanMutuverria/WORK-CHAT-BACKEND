import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.config.js"
import ServerError from "../helper/serverError.helper.js"
function authMiddleware(request, response, next) {
    try {
        //El token GENERALMENTE se envia a el header de authorization
        const auth_header = request.headers.authorization

        if (!auth_header) {
            throw new ServerError('Token faltante', 401)
        }

        //Extraigo el header del token, es decir, separamos la palabra BEARER del token y la descartamos.
        const auth_token = auth_header.split(' ')[1]

        if (!auth_token) {
            throw new ServerError('Token invalido', 401)
        }

        //Verifico que el token sea valido
        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)

        //Le asigno el payload al objeto request para que pueda ser utilizado en los controladores
        request.user = payload

        next()

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return response.status(401).json(
                {
                    message: 'Token invalido',
                    ok: false,
                    status: 401
                }
            )
        }
        
        if (error.status && error.status !== 500) {
            return response.status(error.status).json({
                message: error.message,
                ok: false,
                status: error.status
            })
        } 
        
        return response.status(500).json({
            message: "Error interno",
            ok: false,
            status: 500
        })
    }
}

export default authMiddleware