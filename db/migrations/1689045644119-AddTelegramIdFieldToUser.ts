import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTelegramIdFieldToUser1689045644119
  implements MigrationInterface
{
  name = 'AddTelegramIdFieldToUser1689045644119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "telegramId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5" UNIQUE ("telegramId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegramId"`);
  }
}
