const jwt = require('jsonwebtoken');
const {updateSellerOrderStatus, getOrder,  placeOrderCashpayment, placeOrderOnlinePayment } = require('../services/orderService')
const {generateOrder} = require('../utils/generateOrder')


// Controller for order status
const orderStatus = async (req, res) => {

    const { orderStatusValue, idOrder } = req.body;
    await updateSellerOrderStatus(orderStatusValue, idOrder)
    return res.status(200).json({ success: true, message: "orderstatus updated successfully" })
}


// Controller for user orders
const orderUser = async (req, res) => {

    const userToken = req.params.userid;
    const decoded = await jwt.verify(userToken, process.env.JWT_SECRET)
    console.log(decoded.userId)
    const userOrders = await getOrder(decoded.userId)
    return res.status(200).json(userOrders)
}


// Controller to generate order Id
const orderId = async (req, res) => {

    const total = await req.body.total;
    console.log('Total:', total)
    const order = await generateOrder(total);
    return res.status(200).json({ success: true, message: 'order id generated successfully', order })
}



// Controller to place order
const orderPlace = async (req, res) => {

    const { order, userDetail, userId, razorpay_payment_id } = req.body;
    const decoded = await jwt.verify(userId, process.env.JWT_SECRET)
    if (razorpay_payment_id) {
        await placeOrderOnlinePayment(order, userDetail, decoded, razorpay_payment_id)
        return res.status(200).json({ success: true, message: 'Your order has been Placed' })
    } else {
        const result = await placeOrderCashpayment(order, userDetail, decoded)
        if (result) {
            return res.status(200).json({ success: true, message: 'Your order has been Placed' })
        } else {
            return res.status(400).json({ success: false, message: 'Failed to place order' })
        }
    }
}



module.exports = {
    orderStatus,
    orderUser,
    orderId,
    orderPlace,
}