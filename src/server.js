require('dotenv').config({ path: '../.env' });
const app = require('./app')
const connectToDatabase = require('./db/connect');

const port = process.env.PORT || 6000;

// Connection to database
connectToDatabase();


app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
