import logger from '../../config/logger';
import { EmailModel } from '../../models/email';
export class EmailService {
  // Function to retrieve emails sent to a user with pagination
  public static async getEmailsSentToUser(
    userId: string,
    page: number,
    pageSize: number,
  ) {
    try {
      return EmailModel.getEmailsSentToUser(userId, page, pageSize);
    } catch (error) {
      logger.error(`Failed to fetch emails: ${error}`);
      throw error;
    }
  }
}
