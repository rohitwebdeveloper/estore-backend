const { kart } = require('../models/kart')
const mongoose = require('mongoose')

// Add item to kart
const addToKart = async (userId, productid) => {

    const KartProduct = new kart({
        user: userId,
        product: productid
    })
    await KartProduct.save()
    console.log('Product Added in Kart')
    return true
}


// User kart item
const getKartProduct = async (userId) => {

    const KartItems = await kart.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productDetails'
            },
        },
        {
            $addFields: {
                productdetail: {
                    $arrayElemAt: ['$productDetails', 0]
                }
            }
        },
        {
            $project: {
                productdetail: 1
            }
        }
    ])
    return KartItems
}


// Remove kart item
const removeKartProduct = async (productid) => {
    await kart.deleteOne({ _id: productid })
    return true
}



module.exports = {
    addToKart,
    getKartProduct,
    removeKartProduct,
}