import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsSuccessColumnInEmails1690271227241
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'emails',
      new TableColumn({
        name: 'is_success',
        type: 'boolean',
        default: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('emails', 'is_success');
  }
}
