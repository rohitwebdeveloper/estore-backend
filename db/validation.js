
const validateEmail = (email)=>{
    const regex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email)

}

const validatepassword = (password)=>{
   if (password.length < 8) {
    return false
   } else {
    return true
   }
}

// const validatemobile = (number)=>{
//     if (isNaN(number) || number.length < 10) {
//         return false
//     } else {
//         return true
//     }
// }


module.exports = {validateEmail, validatepassword};