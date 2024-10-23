require('dotenv').config({ path: '../.env' });
const job = require('./utils/keepAlive')
const app = require('./app')
const connectToDatabase = require('./db/connect');

const port = process.env.PORT || 6000;

// Connection to database
connectToDatabase();

// Starting cron job
job.start()

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
