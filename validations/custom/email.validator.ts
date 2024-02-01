import { NextFunction, Request, Response } from 'express';

import { Constants } from '../../const/Constants';
import responseHandler from '../../utils/responseHandler';
import joiValidator from '../joi/validator';
import EmailValidationSchema from '../schema/email.schema';
export class EmailValidator {
  async sendEmail(req: Request, res: Response, next: NextFunction) {
    //joi validation for get user report analytics
    const { error } = joiValidator.joiValidation(
      req.body,
      EmailValidationSchema.sendEmailSchema,
    );

    if (error) {
      return responseHandler.sendResponse(
        Constants.Http.BAD_REQUEST,
        error.message,
        false,
        res,
        true,
      );
    }
    return next();
  }

  async getEmails(req: Request, res: Response, next: NextFunction) {
    //joi validation for get user report analytics
    const { error } = joiValidator.joiValidation(
      req.query,
      EmailValidationSchema.getEmails,
    );

    if (error) {
      return responseHandler.sendResponse(
        Constants.Http.BAD_REQUEST,
        error.message,
        false,
        res,
        true,
      );
    }
    return next();
  }
}

const emailValidator: EmailValidator = new EmailValidator();

export default emailValidator;
