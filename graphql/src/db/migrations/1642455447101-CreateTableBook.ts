import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableBook1642455447101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "book" (\
        "id" serial,\
        "title" varchar UNIQUE NOT NULL,\
        "isPublished" BOOLEAN NOT NULL DEFAULT FALSE,\
        "authorId" int NOT NULL,\
        PRIMARY KEY (id)\
      );'
    );
    await queryRunner.query(
      'ALTER TABLE "book" ADD CONSTRAINT "FK_book_to_author_id"\
        FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey("book", "FK_book_to_author_id");
    await queryRunner.query("DELETE TABLE book;");
  }
}
