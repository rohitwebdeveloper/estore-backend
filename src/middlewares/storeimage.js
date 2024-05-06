// const { diskStorage } = require('multer');
const multer = require('multer');

const storageplace = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const store = multer({storage: storageplace})

module.exports = store;