import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../exceptions/index.js';

const authenticateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing or invalid Authorization header'));
  }

  const token = authorization.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = { userId: decoded.userId };
    return next();
  } catch {
    return next(new AuthenticationError('Access token tidak valid'));
  }
};

export default authenticateToken;
