import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSentTimeToMessage1688723091856 implements MigrationInterface {
    name = 'AddSentTimeToMessage1688723091856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "sentTime" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "sentTime"`);
    }

}
