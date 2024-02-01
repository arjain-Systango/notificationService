import Joi from 'joi';

class FCMTokenValidationSchema {
  static addFcmToken = Joi.object({
    token: Joi.string().required(),
  });

  static deleteFcmToken = Joi.object({
    token: Joi.string().required(),
  });
}
export default FCMTokenValidationSchema;
