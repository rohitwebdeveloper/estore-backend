const { getCategoryProduct, getproduct, getSearchData, saveRating, addproduct, unpublishProduct } = require('../services/productService')
const jwt = require('jsonwebtoken');
const optimizeImg = require('../utils/optimizeImg')
const uploadImg = require('../services/cloudinaryService')



// Controller to get product by category
const productByCategory = async (req, res) => {

    const { category } = req.params;
    const categoryProducts = await getCategoryProduct(category)
    return res.status(200).json({ success: true, message: 'Products fetched successfully', categoryProducts })
}


// Controller to get single product
const singleProduct = async (req, res) => {

    const { productid } = req.params;
    const product = await getproduct(productid)
    if (product) {
        res.status(200).json(product)
    }
}


// Controller to search product
const searchProduct = async (req, res) => {

    const searchVal = req.query.q.toLowerCase().replace(/\s+/g, '');
    const searchresult = await getSearchData(searchVal)
    res.status(200).json(searchresult)
}


// Controller to save rating
const saveProductRating = async (req, res) => {

    const { userid, productid, ratedVal, orderId, orderitemId } = req.body;
    const decoded = await jwt.verify(userid, process.env.JWT_SECRET)
    const result = await saveRating(decoded.userId, productid, ratedVal, orderId, orderitemId)
    if (result) {
        return res.status(200).json({ success: true, message: 'Rating Saved Successfully' })
    }
}


// Controller to publish product
const productPublish = async (req, res) => {

    const { title, description, price, brand, category, subcategory, userid } = req.body;
    console.log('Received details:', title, subcategory)
    const { path } = await req.file;

    if (path == '' || path == null) {
        return res.status(403).json({ success: false, message: 'Image Not Found!, Please upload image' })
    }

    const filepath = await optimizeImg(path);
    const uploadResult = await uploadImg(filepath);
    const decoded = await jwt.verify(userid, process.env.JWT_SECRET)
    await addproduct(title, description, price, brand, category, subcategory, uploadResult.secure_url, decoded.sellerId)
    console.log('New Product Published')
    return res.status(200).json({ success: true, message: 'Your product has been published', uploadResult })
}


// Controller to unpublish product
const productUnpublish = async (req, res) => {

    const productId = req.params.productid
    const sellerProduct = await unpublishProduct(productId)
    if (sellerProduct) {
        return res.status(200).json(sellerProduct)
    }
}




module.exports = {
    productByCategory,
    singleProduct,
    searchProduct,
    saveProductRating,
    productPublish,
    productUnpublish
}