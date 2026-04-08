import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const parseToken = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

export const requireAuth = async (req, res, next) => {
  const token = parseToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, async () => {
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!req.user?.email || !adminEmails.includes(req.user.email.toLowerCase())) {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    return next();
  });
};
