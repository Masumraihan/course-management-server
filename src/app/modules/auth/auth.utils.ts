import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { TJwtPayload } from './auth.interface';
import config from '../../config';
export const createToken = (jwtPayload: TJwtPayload) => {
  return jwt.sign(jwtPayload, config.access_token_secret as string, {
    expiresIn: config.access_token_expire_in,
  });
};

export const hashedPassword = async (password: string) => {
  return await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_Rounds) as number,
  );
};

export const verifyJwt = (token: string) => {
  const decoded = jwt.verify(
    token,
    config.access_token_secret as string,
  ) as JwtPayload;
  return decoded;
};
