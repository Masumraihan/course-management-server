//export type TUserRole = 'user' | 'admin';

import { Model } from 'mongoose';
import { TRegisterUser } from '../auth/auth.interface';

//export type TUser = {
//  username: string;
//  email: string;
//  password?: string;
//  role: TUserRole;
//};

export interface UserStaticMethod extends Model<TRegisterUser> {
  isPasswordMatched(
    plainTextPass: string,
    hashedPass: string,
  ): Promise<boolean>;
  isJWTIssuedTimeGraterThenPasswordChangedTime(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}
