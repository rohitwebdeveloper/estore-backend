const jwt = require('jsonwebtoken');
const {getKartProduct, addToKart, removeKartProduct} = require('../services/kartService')


// Controlller for user kart
const userKart = async (req, res) => {

    const usertoken = req.params.userid;
    const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET)
    const kartItems = await getKartProduct(decoded.userId)
    return res.status(200).json(kartItems)
}


// Controller to add to kart
const addKart = async (req, res) => {

    const usertoken = req.params.userid;
    const { productid } = req.body
    const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET)
    const { userId } = decoded
    const result = addToKart(userId, productid);
    if (result) {
        return res.status(200).json({ success: true, message: 'Added to Kart' })
    } else {
        return res.status(400).json({ success: false, message: "Failed to add to Kart" })
    }
}


// Controller to remove from kart
const removeKart = async (req, res) => {

    const productid = req.params.productid;
    const result = await removeKartProduct(productid)
    if (result) {
        console.log('Kart Product removed succesfully')
        return res.status(200).json('Kart Product Removed Successfully')
    }
}





module.exports = {
    userKart,
    addKart,
    removeKart

}