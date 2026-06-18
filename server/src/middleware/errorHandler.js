// Central error formatter. Services throw errors carrying a `status`; we turn
// those into a consistent JSON shape. Anything without a status is a 500.

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const body = { error: err.message || 'Something went wrong.' };

  if (err.resetAt) {
    body.resetAt = err.resetAt;
  }

  res.status(status).json(body);
}

module.exports = errorHandler;
