import ServerError from "../helper/serverError.helper.js"

export function errorHandler(error, request, response, next) {
    if (error instanceof ServerError || error.status) {
        return response.status(error.status || 400).json({
            message: error.message,
            ok: false,
            status: error.status || 400
        })
    }

    // Capturar errores de Multer (subida de archivos)
    if (error.name === 'MulterError') {
        let message = 'Error al subir el archivo.'
        if (error.code === 'LIMIT_FILE_SIZE') message = 'El archivo es demasiado pesado (máximo 2.5MB).'

        return response.status(400).json({
            message: message,
            ok: false,
            status: 400
        })
    }

    console.error("ERROR NO CONTROLADO:", error)
    return response.status(500).json({
        message: "Lo sentimos, ha ocurrido un error inesperado al procesar tu solicitud.",
        ok: false,
        status: 500
    })
}

export function repositoryErrorHandler(error) {
    // Error de conexión o tiempo de espera agotado (buffering)
    if (
        error.code === 'ENOTFOUND' ||
        error.name === 'MongooseServerSelectionError' ||
        error.message.includes('buffering timed out')
    ) {
        throw new ServerError('No se pudo establecer conexión con el servidor. Por favor, comprueba tu internet o inténtalo de nuevo en unos momentos.', 503);
    }

    if (error.name === 'ValidationError') {
        throw new ServerError('La información proporcionada no cumple con el formato requerido.', 400);
    }

    if (error.name === 'CastError') {
        throw new ServerError('El identificador solicitado no es válido o no existe.', 404);
    }

    throw new ServerError('Lo sentimos, ocurrió un problema al procesar tu solicitud de datos. Por favor, inténtalo más tarde.', 500);
}
