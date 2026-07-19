import { Request, Response } from 'express';
import { User, LoginLog, OTP } from '../models/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendOTP } from '../utils/email.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown IP';
  const userAgent = req.get('User-Agent') || 'Unknown Agent';

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.isBlocked) {
        await LoginLog.create({ userId: user._id, emailAttempted: email, ipAddress, userAgent, status: 'Failed' });
        res.status(403).json({ message: 'Account is blocked. Contact administrator.' });
        return;
      }

      const accessToken = generateAccessToken(user._id.toString(), user.role);
      const refreshToken = generateRefreshToken(user._id.toString(), user.role);

      await LoginLog.create({ userId: user._id, emailAttempted: email, ipAddress, userAgent, status: 'Success' });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      });
    } else {
      await LoginLog.create({ userId: user?._id || null, emailAttempted: email, ipAddress, userAgent, status: 'Failed' });
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }

  try {
    const decoded: any = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || user.isBlocked) {
      res.status(403).json({ message: 'User not found or blocked' });
      return;
    }

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginStep1 = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (user.isBlocked) {
      res.status(403).json({ message: 'Account is blocked. Contact administrator.' });
      return;
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    await OTP.create({ email, code: otpCode });
    try {
      await sendOTP(email, otpCode);
    } catch (emailErr) {
      console.error('Failed to send email, but continuing:', emailErr);
    }
    res.json({ message: 'OTP sent successfully', devOtp: otpCode });
  } catch (error) {
    console.error('Error in loginStep1:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, code: otp });
    if (!otpRecord) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    const now = new Date();
    const diff = now.getTime() - new Date(otpRecord.createdAt).getTime();
    if (diff > 5 * 60 * 1000) {
      res.status(400).json({ message: 'OTP expired' });
      return;
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
