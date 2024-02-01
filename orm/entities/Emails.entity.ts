import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('emails')
export class Emails {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
  @Column('text', {
    nullable: false,
    array: true,
    name: 'user_ids',
  })
  userIds: string[];

  @Index()
  @Column('varchar', {
    nullable: false,
    name: 'template_name',
  })
  templateName: string;

  @Column('varchar', {
    nullable: false,
  })
  subject: string;

  @Column('jsonb')
  details: object;

  @Column('timestamptz', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'requested_dt',
  })
  requestedDt: Date;

  @Column('timestamptz', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'sent_dt',
  })
  sentDt: Date;

  @Column('boolean', {
    default: true,
    name: 'is_success',
  })
  isSuccess: boolean;
}
