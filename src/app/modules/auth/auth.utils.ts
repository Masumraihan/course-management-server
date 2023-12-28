import jwt from 'jsonwebtoken';
import { TJwtPayload, TUserRole } from './auth.interface';
import config from '../../config';
export const createToken = (jwtPayload: TJwtPayload) => {
  return jwt.sign(jwtPayload, config.access_token_secret as string, {
    expiresIn: config.access_token_expire_in,
  });
};
