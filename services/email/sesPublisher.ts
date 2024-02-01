import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import logger from '../../config/logger';
import ParameterStoreConfig from '../../resources/config/parameterStore.config';
import { SecretManagerConfig } from '../../resources/config/secretManager.config';
import { TemplateUtils } from '../../utils/templateUtils';

export class EmailSESPublisherService {
  // Create an instance of the SES client
  private static secret = SecretManagerConfig.secret;
  private static sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: this.secret.NS_SES_AWS_ACCESS_KEY_ID,
      secretAccessKey: this.secret.NS_SES_AWS_SECRET_ACCESS_KEY,
    },
  });
  private static parameterStoreValue = ParameterStoreConfig.parameterStoreValue;
  // Function to send email using AWS SES
  public static async sendEmail(
    receivers: string[],
    templateName: string,
    subject: string,
    details: string,
  ) {
    const template = await TemplateUtils.getTemplateContent(
      templateName,
      'email',
    );
    // Substitute variables in the template using the provided details
    const substitutedTemplate = await TemplateUtils.substituteVariables(
      template as string,
      details,
    );

    const secret = SecretManagerConfig.secret;
    // Construct the email message
    const emailParams = {
      Source: secret.NS_FROM_EMAIL_ADDRESS,
      Destination: {
        ToAddresses: receivers,
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: substitutedTemplate },
        },
      },
    };

    const noOfRetry = 0;
    return await this.sendEmailWithRetry(emailParams, noOfRetry);
  }

  // SesClient call for sending email and retries every 30s if there was any error
  public static async sendEmailWithRetry(emailParams: any, noOfRetry: number) {
    try {
      const command = new SendEmailCommand(emailParams);
      await this.sesClient.send(command);
      logger.info(`Email sent successfully`);
      return true;
    } catch (error: any) {
      noOfRetry++;
      /**
       * Retry Email if no. of retry is less then or equal to max retry ------
       */
      if (noOfRetry <= this.parameterStoreValue.MAX_RETRY_IF_EMAIL_FAILED) {
        logger.error(
          `Failed to send email due to an SES issue. Retrying after 30 seconds.., issue observed: ${error.message}`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, this.parameterStoreValue.RETRY_EMAIL_DELAY),
        ); // Wait for 30 sec before retrying
        await this.sendEmailWithRetry(emailParams, noOfRetry); // Retry sending the email
        return false;
      }
    }
  }
}
