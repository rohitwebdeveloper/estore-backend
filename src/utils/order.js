const rasorpay = require('razorpay');

const instance = new rasorpay({ key_id:process.env.KEY_ID, key_secret:process.env.KEY_SECRET })

const generateOrder = async () =>{
  const orderdetails =  await instance.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    })
    return orderdetails;

}

module.exports = {generateOrder}