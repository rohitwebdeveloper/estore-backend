const { default: mongoose } = require('mongoose')
const product = require('../models/product')


const getElectronicsProduct = async (category) => {
    try {
        // const electronicsProduct = await product.find({category:category})
        // const electronicsProduct = await product.aggregate([
        //     {
        //         $match: {
        //             category: category
        //         }
        //     },
        //     // {
        //     //     $unwind:'$ratingValue'
        //     // },
        //     {
        //         $lookup: {
        //             from: 'ratings',
        //             localField: 'ratingValue',
        //             foreignField: 'productId',
        //             as: 'productRatings'
        //         },
        //         $match: {
        //             productId: new mongoose.Types.ObjectId(productid)
        //         }
        //     },
        //     {
        //         $addFields: {
        //             productrating: {
        //                 $arrayElemAt: ['$productRatings', 0]
        //             }
        //         },

        //     },
        // ])

        // return electronicsProduct
        const electronicsProduct = await product.find({category:category})
        return electronicsProduct
    
    } catch (error) {
        throw new Error('Error in Finding electronics category products')
    }
}

module.exports = {
    getElectronicsProduct,
}