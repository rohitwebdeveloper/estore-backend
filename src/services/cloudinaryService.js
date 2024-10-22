const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadImg = async (imageBuffer) => {

    const options = {
        resource_type: 'image',
        use_filename: true,
        unique_filename: false,
        overwrite: true
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(options, (error, rst) => {
                if (error) {
                    console.log('Failed to upload image')
                    return reject(error)
                }
                resolve(rst)
            })
            streamifier.createReadStream(imageBuffer).pipe(uploadStream)
        })

        return result;

    } catch (error) {
        console.log("Error in Uploading Image")
        console.log(error)
        throw new Error('Error in Uploading Image')
    }
}

module.exports = uploadImg;