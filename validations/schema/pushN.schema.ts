import Joi from 'joi';

import { PushNotificationsStatus } from '../../enums/pushNotification.enum';

class PushNValidationSchema {
  static sendPushNSchema = Joi.object({
    userIds: Joi.array().items(Joi.string()).required(),
    message: Joi.string().required(),
    title: Joi.string().required(),
    templateName: Joi.string().optional(),
    details: Joi.object().optional(),
    placeHolders: Joi.object().optional(),
  });

  static getPushN = Joi.object({
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
    status: Joi.string()
      .valid(
        PushNotificationsStatus.READ,
        PushNotificationsStatus.UNREAD,
        PushNotificationsStatus.DELETED,
      )
      .optional(),
  });

  static updatePushNStatus = Joi.object({
    body: Joi.object({
      status: Joi.string()
        .valid(
          PushNotificationsStatus.READ,
          PushNotificationsStatus.UNREAD,
          PushNotificationsStatus.DELETED,
        )
        .required(),
    }),
    params: {
      uuid: Joi.string().uuid().required(),
    },
  });
}
export default PushNValidationSchema;
