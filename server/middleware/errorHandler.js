export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: 'A unique field already exists.' });
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({ message: 'Validation failed.', details });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id.' });
  }

  res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
}
