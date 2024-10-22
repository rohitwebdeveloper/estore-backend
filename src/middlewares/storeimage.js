
const multer = require('multer');
// const path = require('path');

const storageplace = multer.memoryStorage()

const store = multer({storage: storageplace})

module.exports = store;