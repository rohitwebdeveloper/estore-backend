const mongoose = require('mongoose')
const product = require('../models/product')
const rating = require('../models/Rating')
const { order } = require('../models/order')

// Category Products
const getCategoryProduct = async (category) => {
    const categoryProduct = await product.find({ category: category })
    return categoryProduct
}


// Single Product
const getproduct = async (productid) => {

    const productdetails = await product.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(productid)
            }
        },
        {
            $lookup: {
                from: 'ratings',
                localField: '_id',
                foreignField: 'productId',
                as: 'ratings'
            }
        },
        {
            $addFields: {
                averagerating: { $avg: '$ratings.rateValue' }
            }
        }
    ])
    return productdetails
}



// Search product
const getSearchData = async (searchVal) => {

    const regexPattern = new RegExp(searchVal.split('').join('.*'), 'i');
    let query = {
        $or: [
            { title: { $regex: regexPattern } },
            { subCategory: { $regex: regexPattern } },
            { category: { $regex: regexPattern } },
            { brand: { $regex: regexPattern } }
        ]
    }
    const result = await product.find(query);
    return result;
};



// Save product rating
const saveRating = async (userid, productid, ratedVal, orderId, orderitemId) => {

    const productRating = new rating({
        userId: userid,
        productId: productid,
        rateValue: ratedVal
    })
    const savedRating = await productRating.save()
    const updatedOrder = await order.updateOne({ orderid: orderId, 'orderitem._id': mongoose.Types.ObjectId(orderitemId) }, { $set: { 'orderitem.$.rating': savedRating._id } })
    return true;
}



// Publish new product
const addproduct = async (producttitle, productdescription, productprice, productbrand, productcategory, productsubcategory, producturl, productsellerid) => {

    const newProduct = new product({
        title: producttitle,
        description: productdescription,
        price: productprice,
        brand: productbrand,
        category: productcategory,
        subCategory: productsubcategory,
        url: producturl,
        seller: productsellerid
    })
    await newProduct.save();
    return
}


// Unpublish existing product
const unpublishProduct = async (productId) => {
    await product.deleteOne({ _id: productId })
    return true
}

// Seller products
const getsellerProduct = async (sellerid) => {
    const sellerproduct = await product.find({ seller: sellerid })
    return sellerproduct
}




module.exports = {
    getCategoryProduct,
    getproduct,
    getSearchData,
    saveRating,
    addproduct,
    unpublishProduct,
    getsellerProduct,
}