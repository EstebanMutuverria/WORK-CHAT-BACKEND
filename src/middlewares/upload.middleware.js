import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.config.js'
import ServerError from '../helper/serverError.helper.js'

// Configuración de Cloudinary solo para IMÁGENES
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'messages',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        resource_type: 'image'
    }
})

// Filtro para asegurar que solo se suban imágenes
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new ServerError('Solo se permiten imágenes', 400), false)
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB para imágenes
    },
    fileFilter: fileFilter
})

export default upload
