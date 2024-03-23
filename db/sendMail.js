const nodemailer = require('nodemailer');

// Create a transportor carrier to send mail
const transportor = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "rohitkushwaha.developer@gmail.com",
        pass: 'fvek flsc svei vttg'
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