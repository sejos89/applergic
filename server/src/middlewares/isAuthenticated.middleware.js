function isAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  next(new Error('No autorizado'));
}

module.exports = isAuthenticated;
