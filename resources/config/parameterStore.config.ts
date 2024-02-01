import * as AWS from '@aws-sdk/client-ssm';

import { SecretManagerConfig } from './secretManager.config';
import configurationDetails from '.';

class ParameterStoreConfig {
  static parameterStoreValue: any;
  private static secret = SecretManagerConfig.secret;
  private static client = new AWS.SSM({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: this.secret.NS_PARAMETER_STORE_AWS_ACCESS_KEY_ID,
      secretAccessKey: this.secret.NS_PARAMETER_STORE_AWS_SECRET_ACCESS_KEY,
    },
  });

  public static async getParamterStoreValue() {
    try {
      const requiredKeys = {
        MAX_RETRY_IF_EMAIL_FAILED: null,
        RETRY_EMAIL_DELAY: null,
        MAX_NO_OF_MESSAGES_TO_RETRIVE_FROM_SQS: null,
        AWS_SQS_WAIT_TIME_IN_SECONDS: null,
        JWT_SYSTEM_ROLE: null,
        JWT_USER_ROLE: null,
      };

      this.parameterStoreValue = requiredKeys;
      const keysArray = Object.keys(requiredKeys);

      for (let index = 0; index < keysArray.length; index++) {
        const element = keysArray[index];
        const options = {
          Name: `/${configurationDetails.environment}/${configurationDetails.APP_NAME}/${element}`,
          WithDecryption: false,
        };
        const data = await this.client.getParameter(options).catch((error) => {
          const json = JSON.stringify(error);
          if (
            JSON.parse(json).name !=
            configurationDetails.AWS_ACCESS_DENIED_EXCEPTION
          ) {
            // throw error;
          }
        });

        this.parameterStoreValue[element] = process.env[element]
          ? process.env[element]
          : data?.Parameter?.Value;
      }
    } catch (error) {
      throw error;
    }
  }
}

export = ParameterStoreConfig;
