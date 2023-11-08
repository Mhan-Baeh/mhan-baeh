const requestLogger = (req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
  };

module.exports = {
    requestLogger
}