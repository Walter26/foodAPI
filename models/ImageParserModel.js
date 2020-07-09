const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

aws.config.update({
    secretAccessKey: process.env.KEY,
    accessKeyId: process.env.KEY_ID,
    region: 'us-east-1'
})

const s3 = new aws.S3()

const imageTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/BMP']

const fileFilter = (req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(new Error('Wrong filetype'), false)
    }
}

const upload = multer({
        storage: multerS3({
            s3: s3,
            acl: 'public-read',
            bucket: 'imagesapisv',
            key: function(req, file, cb) {
                cb(null, 'uploads/' + new Date().toISOString() + file.originalname);
            }
        }),
        limits: {
            fileSize: 1024 * 1024 * 5
        }
    })

module.exports = upload