import { Repository } from 'typeorm';

import { DatabaseInitialization } from '../orm/DbCreateConnection';
import { Emails } from '../orm/entities/Emails.entity';

export class EmailModel {
  public static async getEmailsSentToUser(
    userId: string,
    page: number,
    pageSize: number,
  ) {
    const offset = (page - 1) * pageSize;

    const emailRepository: Repository<Emails> =
      await DatabaseInitialization.dataSource.getRepository(Emails);

    const result = await emailRepository
      .createQueryBuilder('emails')
      .where(':userIds = ANY (emails.user_ids)', { userIds: userId })
      .orderBy('emails.requestedDt', 'DESC')
      .skip(offset)
      .take(pageSize);
    const emails = await result.getMany();
    return emails;
  }

  public static async sendEmail(
    uuid: string,
    receivers: string[],
    templateName: string,
    subject: string,
    details: object,
    requestedDt: Date,
    isSuccess: boolean,
  ) {
    const emailRepository: Repository<Emails> =
      await DatabaseInitialization.dataSource.getRepository(Emails);

    await emailRepository.save({
      uuid,
      userIds: receivers,
      templateName: templateName,
      subject,
      details,
      requestedDt,
      isSuccess,
    });
  }
}
