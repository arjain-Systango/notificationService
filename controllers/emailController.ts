import { Request, Response } from 'express';

import logger from '../config/logger';
import { Constants } from '../const/Constants';
import { EmailService } from '../services/email/emailManager';
import { EmailSQSPublisherService } from '../services/email/sqsPublisher';
import responseHandler from '../utils/responseHandler';
import { TemplateNotFoundError, TemplateUtils } from '../utils/templateUtils';

export class EmailController {
  public static async sendEmail(req: Request, res: Response) {
    const { receivers, templateName, subject, details } = req.body;
    try {
      const validTemplate = await TemplateUtils.templateExists(
        templateName,
        'email',
      );
      if (validTemplate) {
        await EmailSQSPublisherService.enqueueMessage(
          receivers,
          templateName,
          subject,
          details,
        );

        responseHandler.sendResponse(
          Constants.Http.OK,
          Constants.SuccessMessage.EMAIL_REQUEST_RECEIVED,
          true,
          res,
        );
      }
    } catch (error: any) {
      if (error instanceof TemplateNotFoundError) {
        logger.error(`Template not found: ${error.message}`);
        responseHandler.sendResponse(
          Constants.Http.NOT_FOUND,
          Constants.ErrorMessage.TEMPLATE_NOT_FOUND,
          false,
          res,
          true,
        );
      } else {
        logger.error(`Unhandled error: ${error.message}`);

        responseHandler.sendResponse(
          Constants.Http.INTERNAL_SERVER_ERROR,
          Constants.ErrorMessage.INTERNAL_SERVER_ERROR,
          false,
          res,
          true,
        );
      }
    }
  }

  public static async getEmails(req: Request, res: Response) {
    const userEmailId = req.query.email as string;
    const { page, pageSize } = req.query;
    try {
      const emails = await EmailService.getEmailsSentToUser(
        userEmailId,
        page ? +page : 1,
        pageSize ? +pageSize : 10,
      );
      responseHandler.sendResponse(Constants.Http.OK, emails, true, res);
    } catch (error) {
      logger.error(`Failed to fetch emails: ${error}`);

      responseHandler.sendResponse(
        Constants.Http.INTERNAL_SERVER_ERROR,
        Constants.ErrorMessage.FAILED_TO_FETCH_EMAILS,
        false,
        res,
        true,
      );
    }
  }
}
