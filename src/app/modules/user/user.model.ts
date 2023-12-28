/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import config from '../../config';
import { TUser } from './user.interface';

const UserSchema = new Schema<TUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

UserSchema.pre('save', function (next) {
  const password = this.password;
  if (password) {
    bcrypt
      .hash(password, Number(config.bcrypt_salt_Rounds) as number)
      .then(hashedPass => {
        this.password = hashedPass;
        next();
      })
      .catch((err: any) => {
        next(err);
      });
  }
});

export const UserModel = mongoose.model<TUser>('User', UserSchema);
