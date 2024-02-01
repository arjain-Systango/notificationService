import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateEmailTable1687937868571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'emails',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'user_ids',
            type: 'text[]',
          },
          {
            name: 'template_name',
            length: '255',
            type: 'varchar',
          },
          {
            name: 'subject',
            length: '255',
            type: 'varchar',
          },
          {
            name: 'details',
            type: 'jsonb',
          },
          {
            name: 'requested_dt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'sent_dt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );
    await queryRunner.createIndex(
      'emails',
      new TableIndex({
        name: 'idx_emails_userIds_template_name',
        columnNames: ['user_ids', 'template_name'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable(
      new Table({
        name: 'emails',
      })
    );
  }
}
