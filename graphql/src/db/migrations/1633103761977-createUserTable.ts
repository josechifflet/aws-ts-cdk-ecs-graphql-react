import { MigrationInterface, QueryRunner } from "typeorm";

export class createUsersTable1633103761977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "user" (\
        "id" uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4(),\
        "email" varchar NOT NULL,\
        "password" varchar NOT NULL,\
        PRIMARY KEY ("email")\
      );'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }
}
