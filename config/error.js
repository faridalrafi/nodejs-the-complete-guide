exports.error = (error, req, res) => {
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
};
