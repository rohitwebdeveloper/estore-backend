// const { diskStorage } = require('multer');
const multer = require('multer');
const path = require('path');

const storageplace = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public') )
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const store = multer({storage: storageplace})

module.exports = store;