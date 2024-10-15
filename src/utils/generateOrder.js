const rasorpay = require('razorpay');

const instance = new rasorpay({ key_id:process.env.KEY_ID, key_secret:process.env.KEY_SECRET })

const generateOrder = async (total) =>{
  try {
    const orderdetails =  await instance.orders.create({
          amount: total,
          currency: "INR",
          receipt: "receipt#1",
          notes: {
              key1: "value3",
              key2: "value2"
          }
      })
      return orderdetails;
  } catch (error) {
    console.log(error);
    throw new Error(error)
  }

}

module.exports = {generateOrder}