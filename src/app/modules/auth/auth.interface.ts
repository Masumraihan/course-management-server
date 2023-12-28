import { Types } from 'mongoose';

export type TUserRole = 'user' | 'admin';

export type TRegisterUser = {
  username: string;
  email: string;
  password: string;
  role: TUserRole;
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
