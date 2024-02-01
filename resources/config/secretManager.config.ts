import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

import configurationDetails from '.';
export class SecretManagerConfig {
  public static secret: any;
  private static client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });

  static async getSecretManagerValue() {
    let response;

    if (!this.secret) {
      try {
        response = await this.client
          .send(
            new GetSecretValueCommand({
              SecretId: `${configurationDetails.APP_NAME}/${configurationDetails.environment}`,
              VersionStage: 'AWSCURRENT',
            }),
          )
          .catch((error) => {
            const json = JSON.stringify(error);
            if (
              JSON.parse(json).name !=
              configurationDetails.AWS_ACCESS_DENIED_EXCEPTION
            ) {
              // throw error;
            }
          });

        const secret = response
          ? JSON.parse(response.SecretString as string)
          : {};

        const requiredSecretKey = {
          NS_AWS_REGION: null,
          NS_AWS_SQS_QUEUE_URL_EMAIL: null,
          NS_AWS_SQS_MESSAGE_GROUP_ID_EMAIL: null,
          NS_AWS_SQS_QUEUE_URL_PUSH: null,
          NS_AWS_SQS_MESSAGE_GROUP_ID_PUSH: null,
          NS_FROM_EMAIL_ADDRESS: null,
          NS_FCM_JSON: null,
          NS_DB_HOST: null,
          NS_DB_PORT: null,
          NS_DB_USER: null,
          NS_DB_PASSWORD: null,
          NS_DB_NAME: null,
          JWT_SECRET: null,
          NS_API_KEY: null,
          NS_SQS_AWS_ACCESS_KEY_ID: null,
          NS_SQS_AWS_SECRET_ACCESS_KEY: null,
          NS_SES_AWS_ACCESS_KEY_ID: null,
          NS_SES_AWS_SECRET_ACCESS_KEY: null,
          NS_PARAMETER_STORE_AWS_ACCESS_KEY_ID: null,
          NS_PARAMETER_STORE_AWS_SECRET_ACCESS_KEY: null,
        };
        this.secret = secret;
        for (const key in requiredSecretKey) {
          this.secret[key] = process.env[key] ? process.env[key] : secret[key];
        }
        return this.secret;
      
      } catch (error) {
        throw error;
      }
    }

    return this.secret;
  }
}
