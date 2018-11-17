exports.error = (error, req, res, next) => {
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
};
