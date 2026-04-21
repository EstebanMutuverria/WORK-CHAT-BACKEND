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
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
})

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new ServerError('Solo se permiten imágenes', 400), false)
    }
    // El tamaño se valida automáticamente en el objeto 'limits'
    cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2.5 * 1024 * 1024 // 2.5MB
    },
    fileFilter: fileFilter
})

export default upload
