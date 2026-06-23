import jwt from 'jsonwebtoken';
import { envConfig } from '../../config/env';

export interface JwtPayload {
  userId: string;
  email:  string;
  role:   'subscriber' | 'admin';
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;
};
