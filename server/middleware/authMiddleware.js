function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'] || req.query.userId || (req.body && req.body.userId);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }
  req.userId = parseInt(userId, 10);
  next();
}

module.exports = authMiddleware;
