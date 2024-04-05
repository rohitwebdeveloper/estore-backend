const nodemailer = require('nodemailer');

// Create a transportor carrier to send mail
const transportor = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
})


// Defining function for sending email to the user
const sendEmail = async (mailInfo)=>{
    try {
      const emailresult =  await transportor.sendMail(mailInfo)
      return emailresult;
    //   console.log(emailresult);
    } catch (error) {
        throw new Error("Failed to send email")
        // console.log('sendMail..js error:', error);
    }
}

module.exports = {sendEmail};