const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const connectToDatabase = async()=>{
    
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to database");
        
    } catch (error) {
        console.log("Unable to connect to database", error);
    }

}

module.exports = connectToDatabase;
