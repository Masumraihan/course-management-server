import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import GenericError from '../errors/GenericError';
import { TUserRole } from '../modules/auth/auth.interface';
import { verifyJwt } from '../modules/auth/auth.utils';
import { UserModel } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...roles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // CHECK TOKEN IS GIVEN OR NOT
    if (!token) {
      throw new GenericError('Unauthorized Access', httpStatus.UNAUTHORIZED);
    }

    // VERIFY TOKEN
    const decoded = verifyJwt(token);

    const { _id, email, role } = decoded as JwtPayload;

    const user = await UserModel.findOne({ _id, email });

    if (!user) {
      throw new GenericError('Unauthorized Access', httpStatus.UNAUTHORIZED);
    }

    //req.user = decoded as JwtPayload;

    //if (
    //  user.passwordChangedAt &&
    //  UserModel.isJWTIssuedTimeGraterThenPasswordChangedTime(
    //    user.passwordChangedAt,
    //    iat as number,
    //  )
    //) {
    //  throw new GenericError(
    //    'Unauthorized Access',
    //    httpStatus.FORBIDDEN,
    //  );
    //}


    if (roles && !roles.includes(role)) {
      throw new GenericError('Unauthorized Access', httpStatus.UNAUTHORIZED);
    }
    next();
  });
};

export default auth;
