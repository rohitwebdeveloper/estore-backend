const cron = require('cron');
const https = require('https');

const urlBackend = 'https://e-store-n221.onrender.com/products/663a23c4b2651f669d44535d';

const job = new cron.CronJob('*/4 * * * *', () => {
    https.get(urlBackend, (res) => {
        if (res.statusCode === 200) {
            console.log('Server Pinged successfully with status code:', res.statusCode);
        } else {
            console.log('Failed to ping the server. Status code:', res.statusCode);
        }
    }).on('error', (err) => {
        console.log('Error in pinging the server:', err.message);
    });
});

// // Start the cron job
// job.start();

module.exports = job;