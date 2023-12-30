/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import config from '../../config';
import { TRegisterUser } from '../auth/auth.interface';
import { UserStaticMethod } from './user.interface';

const UserSchema = new Schema<TRegisterUser, UserStaticMethod>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    passwordChangedAt: { type: Date, select: 0 },
    //updatedAt: { type: String },
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

UserSchema.statics.isPasswordMatched = async function (
  plainTextPass: string,
  hashedPass: string,
) {
  return await bcrypt.compare(plainTextPass, hashedPass);
};

UserSchema.statics.isJWTIssuedTimeGraterThenPasswordChangedTime = function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimeStamp).getTime() / 1000;

  return passwordChangedTime > jwtIssuedTimeStamp;
};

export const UserModel = mongoose.model<TRegisterUser, UserStaticMethod>(
  'User',
  UserSchema,
);
