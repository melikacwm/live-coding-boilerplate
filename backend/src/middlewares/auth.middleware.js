const jwt = require('jsonwebtoken');

/**
 * Memverifikasi JWT dari header Authorization: Bearer <token>
 * dan menempelkan payload ke req.user.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, nama, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
  }
}

module.exports = authMiddleware;
