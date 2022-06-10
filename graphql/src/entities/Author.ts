import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Book } from "./Book";

@Entity()
@ObjectType()
export class Author extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String, { nullable: true })
  @Column()
  country?: string;

  @Field(() => Int)
  @Column()
  age!: number;

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, book => book.author )
  public books?: Book[]
}
