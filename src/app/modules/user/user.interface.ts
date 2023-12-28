export type TUserRole = 'user' | 'admin';

export type TUser = {
  username: string;
  email: string;
  password?: string;
  role: TUserRole;
};
