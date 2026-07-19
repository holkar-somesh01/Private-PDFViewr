import jwt from 'jsonwebtoken';

export const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_123', {
    expiresIn: '15m', // Short-lived access token
  });
};

export const generateRefreshToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_123', {
    expiresIn: '1d', // 1 day refresh token
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_123');
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_123');
};
