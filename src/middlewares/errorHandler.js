import ServerError from "../helper/serverError.helper.js"

function errorHandler(error, request, response, next) {
    if (error instanceof ServerError) {
        return response.status(error.status).json({
            message: error.message,
            ok: false,
            status: error.status
        })
    } else {
        console.error(error)
        return response.status(500).json({
            message: "Error interno",
            ok: false,
            status: 500
        })
    }
}

export default errorHandler