import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import logger from '../../config/logger';
import { EmailModel } from '../../models/email';
import configurationDetails from '../../resources/config';
import ParameterStoreConfig from '../../resources/config/parameterStore.config';
import { SecretManagerConfig } from '../../resources/config/secretManager.config';
import { EmailSESPublisherService } from './sesPublisher';
import { EmailSQSPublisherService } from './sqsPublisher';

export class EmailSQSSubscriberService {
  // Create an instance of the SQS client
  private static secret = SecretManagerConfig.secret;
  private static sqsClient = new SQSClient({
    region: configurationDetails.AWS_REGION,
    credentials: {
      accessKeyId: this.secret.NS_SQS_AWS_ACCESS_KEY_ID,
      secretAccessKey: this.secret.NS_SQS_AWS_SECRET_ACCESS_KEY,
    },
  });

  private static parameterStoreValue = ParameterStoreConfig.parameterStoreValue;
  private static params = {
    QueueUrl: this.secret.NS_AWS_SQS_QUEUE_URL_EMAIL,
    MaxNumberOfMessages: this.parameterStoreValue.MAX_NO_OF_MESSAGES_TO_RETRIVE_FROM_SQS, // Adjust as needed
    WaitTimeSeconds: this.parameterStoreValue.AWS_SQS_WAIT_TIME_IN_SECONDS, // Adjust as needed
    VisibilityTimeout: this.parameterStoreValue.RETRY_EMAIL_DELAY * this.parameterStoreValue.MAX_RETRY_IF_EMAIL_FAILED,
  };

  // Function to start listening to the SQS queue
  public static async startListening() {
    while (true) {
      try {
        const command = new ReceiveMessageCommand(this.params);
        const response = await this.sqsClient.send(command);
        if (response.Messages && response.Messages.length > 0) {
          for (const message of response.Messages) {
            await this.processMessage(message);
            await EmailSQSPublisherService.dequeueMessage(
              message.ReceiptHandle,
            );
          }
        }
      } catch (error) {
        logger.error(`Failed to receive message from SQS queue: ${error}`);
        throw error;
      }
    }
  }

  // Function to process a single message
  public static async processMessage(message: any) {
    try {
      const { uuid, receivers, templateName, subject, details, requestedDt } =
        JSON.parse(message.Body);
      const isSuccess = (await EmailSESPublisherService.sendEmail(
        receivers,
        templateName,
        subject,
        details,
      )) as boolean;
      await EmailModel.sendEmail(
        uuid,
        receivers,
        templateName,
        subject,
        details,
        requestedDt,
        isSuccess,
      );
      logger.info(`Email sent for message: ${message.MessageId}`);
      return true; // Return success status
    } catch (error) {
      logger.error(`Failed to process message: ${error}`);
    }
    return false; // Return failure status
  }
}
