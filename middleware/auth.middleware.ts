import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import { Constants } from '../const/Constants';
import { SecretManagerConfig } from '../resources/config/secretManager.config';
import responseHandler from '../utils/responseHandler';

export class AuthMiddleware {
  private static secret = SecretManagerConfig.secret;
  static auth = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return responseHandler.sendResponse(
          Constants.Http.UNAUTHORIZED,
          Constants.ErrorMessage.AUTHORIZATION_HEADER_MISSING,
          true,
          res,
          true,
        );
      }

      let user: any;
      try {
        user = jwt.verify(token, AuthMiddleware.secret.JWT_SECRET);
      } catch (error) {
        logger.error('Error in AuthMiddleware : auth', error);
        return responseHandler.sendResponse(
          Constants.Http.UNAUTHORIZED,
          Constants.ErrorMessage.UNAUTHORIZED,
          true,
          res,
          true,
        );
      }

      if (!user.role) {
        return responseHandler.sendResponse(
          Constants.Http.UNAUTHORIZED,
          Constants.ErrorMessage.INVALID_AUTHORIZATION_TOKEN,
          true,
          res,
          true,
        );
      }

      if (user.role != role) {
        return responseHandler.sendResponse(
          Constants.Http.UNAUTHORIZED,
          Constants.ErrorMessage.INVALID_AUTHORIZATION_ROLE,
          true,
          res,
          true,
        );
      }

      return next();
    };
  };

  public static validateApiKey(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return responseHandler.sendResponse(
        Constants.Http.UNAUTHORIZED,
        Constants.ErrorMessage.AUTHORIZATION_HEADER_MISSING,
        true,
        res,
        true,
      );
    }
    if (AuthMiddleware.secret.NS_API_KEY != apiKey) {
      return responseHandler.sendResponse(
        Constants.Http.FORBIDDEN,
        Constants.ErrorMessage.INVALID_API_KEY,
        true,
        res,
        true,
      );
    }
    next();
  }
}
