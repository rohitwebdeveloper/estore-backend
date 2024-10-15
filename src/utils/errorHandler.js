const errorHandler = async (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    console.log(err)
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error', 
    });
};


module.exports = errorHandler;
