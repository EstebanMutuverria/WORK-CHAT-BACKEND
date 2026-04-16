import multer from 'multer'
import path from 'path'
import fs from 'fs'
import ServerError from '../helper/serverError.helper.js'

// Asegurar que la carpeta de destino existe
const uploadDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        // Nombre de archivo único: timestamp + extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// Filtro de archivos por formato
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb(new ServerError('Solo se permiten imágenes (jpg, jpeg, png)', 400))
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: fileFilter
})

export default upload
