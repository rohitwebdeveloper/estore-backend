const product = require('../models/product');

const addproduct = async (producttitle, productdescription, productprice, productbrand, productcategory, productsubcategory, producturl, productsellerid) => {
    try {
        const newProduct = new product({
            title:producttitle,
            description:productdescription,
            price:productprice,
            brand:productbrand,
            category:productcategory,
            subCategory:productsubcategory,
            url:producturl,
            seller:productsellerid
        })
    
        await newProduct.save();
        return
    } catch (error) {
        console.log("error",error);
        throw new Error('Error in adding product');
    }
}

module.exports = {addproduct};
