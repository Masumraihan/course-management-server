import { Schema, model } from 'mongoose';
import { TPasswordChangedHistory } from '../auth/auth.interface';

const ChangePasswordHistorySchema = new Schema<TPasswordChangedHistory>(
  {
    user: Schema.Types.ObjectId,
    passwords: [{ type: String }],

  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ChangedPasswordHistoryModel = model<TPasswordChangedHistory>(
  'PasswordChangeHistory',
  ChangePasswordHistorySchema,
);
