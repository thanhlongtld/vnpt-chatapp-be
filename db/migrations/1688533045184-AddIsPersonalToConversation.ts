import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPersonalToConversation1688533045184 implements MigrationInterface {
    name = 'AddIsPersonalToConversation1688533045184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ADD "isPersonal" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "isPersonal"`);
    }

}
