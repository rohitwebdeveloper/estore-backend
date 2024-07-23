const product = require('../models/product')


const getElectronicsProduct = async (category) => {
    try {
        const electronicsProduct = await product.find({category:category})
        return electronicsProduct
    } catch (error) {
       throw new Error('Error in Finding electronics category products') 
    }
}

module.exports = {
    getElectronicsProduct,
}