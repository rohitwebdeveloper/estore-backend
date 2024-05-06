const sharp = require('sharp');
const path = require('path')
const fs = require('fs')


const optimizeImg = async (imgPath) => {

    try {
        const imgName = await path.basename(imgPath);
        const outputPath = `../public/estore-${imgName}`
        const sharpResult = await sharp(imgPath)
            .resize(200, 200)
            .webp({ quality: 80 })
            .toFile(outputPath)
         console.log('Image Optimization Result:', sharpResult)
        fs.unlinkSync(imgPath)
        return outputPath
    } catch (error) {
        console.log("Error in optimizing image:", error)
        throw new Error('Error in optimizing Image')
    }

}

module.exports = optimizeImg;