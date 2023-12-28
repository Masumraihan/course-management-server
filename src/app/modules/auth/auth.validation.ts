import { z } from 'zod';

const registerUserValidation = z.object({
  username: z.string(),
  email: z.string().email({ message: 'Please provide valid email' }),
  password: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
});

const loginValidationSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export const AuthValidation = {
  registerUserValidation,
  loginValidationSchema,
};
