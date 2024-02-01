export class ConfigurationManager {
  private configurationDetails: any;
  constructor(isReadFromEnv = false) {
    if (isReadFromEnv) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('dotenv').config();
    }
    const env: string = process.env.NODE_ENV || 'development';
    this.configurationDetails = Object.assign(
      {},
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./env.common').default
    );
  }

  getConfigurationDetails(): any {
    return this.configurationDetails;
  }
}
