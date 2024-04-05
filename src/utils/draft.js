// const { OAuth2Client } = require('google-auth-library')

// const insertStudent = async (studentdetail) => {
//   try {
//     const student = new studentModel(studentdetail);
      //  student.name=rohit
//     await student.save();
//     console.log(student)
//   } catch (error) {
//     console.log(error);
//   }
// }



// const updateStudent = async (studentfatherName) => {
//   try {
//     await studentModel.updateOne({ fatherName: studentfatherName }, { name: 'Om Prakash Upadhayay' });
//     console.log("Details Updated:")
//   } catch (error) {
//     console.log(error);
//   }
// }

// const findallstudent = async (detail) => {
//   try {
//     return await studentModel.find({ name: detail });

//   } catch (error) {
//     console.log(error);
//   }
// }


// const studentSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     class:{
//         type:Number,
//         default:10
//     },
//     age:{
//         type:Number,
//         required:true
//     },
//     fatherName:{
//         type:String,
//         required:true
//     },
//     mobileNumber:{
//         type:Number,
//         required:true
//     }

// })

// const studentModel = mongoose.model("student", studentSchema);