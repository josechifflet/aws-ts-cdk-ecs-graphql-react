import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAuthor1642455400745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "author" (\
        "id" SERIAL,\
        "name" VARCHAR UNIQUE NOT NULL,\
        "country" VARCHAR NOT NULL,\
        "age" INT NOT NULL,\
        PRIMARY KEY ("id")\
      );'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DELETE TABLE author;");
  }
}
