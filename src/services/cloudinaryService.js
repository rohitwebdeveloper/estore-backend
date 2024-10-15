const cloudinary = require('cloudinary').v2;
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadImg = async (imgPath) => {

    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
    }

    try {
        const result = await cloudinary.uploader.upload(imgPath, options);
         fs.unlinkSync(imgPath)
        // console.log('Cloudinary Result:', result);
        return result;

    } catch (error) {
        console.log("Error in Uploading Image")
        console.log(error)
        fs.unlinkSync(imgPath)
        throw new Error('Error in Uploading Image')
    }
}

module.exports = uploadImg;