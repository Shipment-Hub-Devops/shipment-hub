/* eslint-disable no-unused-vars */
// Central error handler — must keep the 4-arg signature for Express.
module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
  });
};
