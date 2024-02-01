import {
  DeleteMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';

import logger from '../../config/logger';
import configurationDetails from '../../resources/config';
import { SecretManagerConfig } from '../../resources/config/secretManager.config';

export class EmailSQSPublisherService {
  private static secret = SecretManagerConfig.secret;
  private static sqsClient = new SQSClient({
    region: configurationDetails.AWS_REGION,
    credentials: {
      accessKeyId: this.secret.NS_SQS_AWS_ACCESS_KEY_ID,
      secretAccessKey: this.secret.NS_SQS_AWS_SECRET_ACCESS_KEY,
    },
  });
  // Function to send a message to the SQS queue
  public static async enqueueMessage(
    receivers: string[],
    templateName: string,
    subject: string,
    details: string,
  ) {
    const requestedDt = new Date(); //date of email send request
    const uuid = uuidv4();
    const message = {
      uuid,
      receivers,
      templateName,
      subject,
      details,
      requestedDt,
    };

    const params = {
      QueueUrl: this.secret.NS_AWS_SQS_QUEUE_URL_EMAIL,
      MessageBody: JSON.stringify(message),
      MessageGroupId: this.secret.NS_AWS_SQS_MESSAGE_GROUP_ID_EMAIL,
      MessageDeduplicationId: uuid,
    };

    try {
      // Send the message to the SQS queue
      const command = new SendMessageCommand(params);
      await this.sqsClient.send(command);
      logger.info(`Message sent to SQS queue`);
    } catch (error) {
      logger.error(`Failed to send message to SQS queue: ${error}`);
      throw error;
    }
  }

  // Function to delete a message from the SQS queue
  public static async dequeueMessage(receiptHandle: any) {
    const params = {
      QueueUrl: this.secret.NS_AWS_SQS_QUEUE_URL_EMAIL,
      ReceiptHandle: receiptHandle,
    };

    try {
      // Delete the message from the SQS queue
      const command = new DeleteMessageCommand(params);
      await this.sqsClient.send(command);
      logger.info(`Message deleted from SQS queue`);
    } catch (error) {
      logger.error(`Failed to delete message from SQS queue: ${error}`);
      throw error;
    }
  }
}
