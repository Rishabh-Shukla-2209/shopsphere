export default function(err, req, res, next) {
    const errorCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(errorCode).json({
        status: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}