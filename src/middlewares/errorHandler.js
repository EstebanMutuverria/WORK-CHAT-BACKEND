import ServerError from "../helper/serverError.helper.js"

function errorHandler(error, request, response, next) {
    if (error instanceof ServerError || error.status) {
        return response.status(error.status || 400).json({
            message: error.message,
            ok: false,
            status: error.status || 400
        })
    } else {
        console.error("ERROR NO CONTROLADO:", error)
        return response.status(500).json({
            message: "Error interno: " + error.message,
            ok: false,
            status: 500
        })
    }
}

export default errorHandler