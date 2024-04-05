const product = require('../models/product');

const addproduct = async (producttitle, productdescription, productprice, productcategory, productsubcategory, producturl) => {
    try {
        const newProduct = new product({
            title:producttitle,
            description:productdescription,
            price:productprice,
            category:productcategory,
            subCategory:productsubcategory,
            url:producturl
        })
    
        await newProduct.save();
        return
    } catch (error) {
        console.log("error",error);
        throw new Error('Error in adding product');
    }
}

module.exports = {addproduct};
