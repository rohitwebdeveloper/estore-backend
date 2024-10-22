const sharp = require('sharp');

const optimizeImg = async (imageBuffer) => {

    try {
        const sharpResult = await sharp(imageBuffer)
            .resize(200, 300)
            .webp({ quality: 80 })
            .toBuffer()
         console.log('Image Optimization successful')
        return sharpResult;
    } catch (error) {
        console.log("Error in optimizing image:", error)
        throw new Error('Error in optimizing Image')
    }

}

module.exports = optimizeImg;