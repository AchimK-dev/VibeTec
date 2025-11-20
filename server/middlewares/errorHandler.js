const errorHandler = (err, req, res, next) => {
  res.status(err.cause || 500).json({ error: err.message });
};

export default errorHandler;
