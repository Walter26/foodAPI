const multer = require('multer')

const imageTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/BMP']

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(new Error('Wrong filetype'), false)
    }
}

const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    })

module.exports = upload