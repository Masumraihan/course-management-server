import { Types } from 'mongoose';

export type TUserRole = 'user' | 'admin';

export type TRegisterUser = {
  username: string;
  email: string;
  password: string;
  role: TUserRole;
  updatedAt: string;
  passwordChangedAt?: Date;
};

export type TLoginUser = {
  username: string;
  password: string;
};

export type TJwtPayload = {
  _id: Types.ObjectId;
  role: TUserRole;
  email: string;
};

export type TChangePassword = {
  currentPassword: '123456';
  newPassword: string;
};

export type TPasswordChangedHistory = {
  user: Types.ObjectId;
  passwords: string[];
};
