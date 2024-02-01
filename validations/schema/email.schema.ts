import Joi from 'joi';

class EmailValidationSchema {
  static sendEmailSchema = Joi.object({
    receivers: Joi.array().items(Joi.string()).required(),
    templateName: Joi.string().required(),
    subject: Joi.string().required(),
    details: Joi.object().optional(),
  });

  static getEmails = Joi.object({
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  });
}
export default EmailValidationSchema;
