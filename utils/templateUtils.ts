import fs from 'fs';
import path from 'path';

import logger from '../config/logger';

export class TemplateNotFoundError extends Error {
  constructor(templateName: string) {
    super(`Template '${templateName}' does not exist.`);
    this.name = 'TemplateNotFoundError';
  }
}

export class TemplateUtils {
  public static async templateExists(
    templateName: string,
    templateType: 'email' | 'pushN',
  ) {
    try {
      const templatePath = path.join(
        __dirname,
        `../views/${templateType}Templates/${templateName}.html`,
      );

      if (!fs.existsSync(templatePath)) {
        throw new TemplateNotFoundError(templateName);
      }
      return true;
    } catch (error) {
      logger.error(`Failed to check template existence: ${error}`);
      throw error;
    }
  }

  public static async getTemplateContent(
    templateName: string,
    templateType: 'email' | 'pushN',
  ) {
    try {
      const validTemplate = await this.templateExists(
        templateName,
        templateType,
      );
      if (validTemplate) {
        const templatePath = path.join(
          __dirname,
          `../views/${templateType}Templates/${templateName}.html`,
        );
        const template = await fs.promises.readFile(templatePath, 'utf8');
        return template;
      }
    } catch (error) {
      logger.error(
        `Failed to read template file: ${templateName} with error: ${error}`,
      );
      throw error;
    }
  }

  public static async substituteVariables(template: string, details: string) {
    let substitutedTemplate = template;

    for (const [key, value] of Object.entries(details)) {
      const variablePlaceholder = `{{${key}}}`;
      substitutedTemplate = substitutedTemplate.replace(
        new RegExp(variablePlaceholder, 'g'),
        value,
      );
    }
    return substitutedTemplate;
  }
}
