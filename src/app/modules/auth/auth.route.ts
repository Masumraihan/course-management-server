import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerUserValidation),
  AuthController.userRegistration,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);
router.post(
  '/change-password',
  auth('admin', 'user'),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);
export const AuthRoute = router;
