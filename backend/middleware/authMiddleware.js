import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret } from '../utils/jwtSecrets.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, getJwtSecret('JWT_SECRET'));
      req.user = await User.findById(decoded.id).select('-password +tokenVersion');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      if (Number(decoded.version || 0) !== Number(req.user.tokenVersion || 0)) {
        return res.status(401).json({ message: 'Not authorized, session expired' });
      }
      next();
    } catch (error) {
      console.error(`Auth error: ${error.message}`);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const optionalProtect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(authorization.split(' ')[1], getJwtSecret('JWT_SECRET'));
    req.user = await User.findById(decoded.id).select('-password +tokenVersion');
    if (!req.user) return res.status(401).json({ message: 'Not authorized, user not found' });
    if (Number(decoded.version || 0) !== Number(req.user.tokenVersion || 0)) {
      return res.status(401).json({ message: 'Not authorized, session expired' });
    }
    return next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect, optionalProtect, admin };
