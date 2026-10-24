import jwt from 'jsonwebtoken';
import { getJwtSecret } from './jwtSecrets.js';

const generateToken = (res, user) => {
  const userId = user?._id || user;
  const tokenVersion = Number(user?.tokenVersion || 0);
  const accessToken = jwt.sign({ id: userId, version: tokenVersion }, getJwtSecret('JWT_SECRET'), {
    expiresIn: '15m', // Short lived access token
  });

  const refreshToken = jwt.sign({ id: userId, version: tokenVersion }, getJwtSecret('JWT_REFRESH_SECRET'), {
    expiresIn: '7d', // Long lived refresh token
  });

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};

export default generateToken;
