const notFound = (req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandle = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandle };
