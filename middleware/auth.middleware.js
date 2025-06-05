import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: 'Access denied' });
    next();
  };
};