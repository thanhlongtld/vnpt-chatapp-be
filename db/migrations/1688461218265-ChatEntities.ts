import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatEntities1688461218265 implements MigrationInterface {
  name = 'ChatEntities1688461218265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "userId" integer, "conversationId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "name" character varying, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation_member" ("id" SERIAL NOT NULL, "joinedTime" TIMESTAMP WITH TIME ZONE NOT NULL, "leftTime" TIMESTAMP WITH TIME ZONE, "userId" integer, "conversationId" integer, CONSTRAINT "PK_ed07d3bc360f4e68836841b8358" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_member" ADD CONSTRAINT "FK_dd563b686e428caa50c69ca5e1e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_member" ADD CONSTRAINT "FK_b15b0ed425fb8a2928f16db6fc8" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation_member" DROP CONSTRAINT "FK_b15b0ed425fb8a2928f16db6fc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_member" DROP CONSTRAINT "FK_dd563b686e428caa50c69ca5e1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`,
    );
    await queryRunner.query(`DROP TABLE "conversation_member"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
