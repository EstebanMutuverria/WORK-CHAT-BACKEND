import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import ServerError from '../helper/serverError.helper.js'
import ENVIRONMENT from '../config/environment.config.js'

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: ENVIRONMENT.CLOUDINARY_CLOUD_NAME,
    api_key: ENVIRONMENT.CLOUDINARY_API_KEY,
    api_secret: ENVIRONMENT.CLOUDINARY_API_SECRET
})

// Configuración del almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'workspaces',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        // Opcional: transformaciones para optimizar premium vibes
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
})

// Filtro de archivos (redundante pero añade una capa extra)
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new ServerError('Solo se permiten imágenes', 400), false)
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: fileFilter
})

export default upload
