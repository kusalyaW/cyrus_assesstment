export function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });
  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
