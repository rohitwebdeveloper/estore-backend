const mongoose = require('mongoose');
const mongouri = "mongodb+srv://rohitkushwahadeveloper:ajYBUqyfL5NVMadp@rohitdatacluster.xlfcfph.mongodb.net/estoredatabase?retryWrites=true&w=majority"

mongoose.set('strictQuery', false);
const connectToDatabase = async()=>{
    
    try {
        await mongoose.connect(mongouri);
        console.log("Connection Successfull");
        
    } catch (error) {
        console.log("Unable to connect", error);
    }

}

module.exports = connectToDatabase;
