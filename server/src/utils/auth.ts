import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../types';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: 60 * 60 * 24 * 7 } as any);
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: 60 * 60 * 24 * 30 } as any);
};

export const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const userObj = user.toObject();
  delete userObj.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      token,
      refreshToken,
      user: userObj,
    });
};

export const sanitizeUser = (user: IUser) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};
