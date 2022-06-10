import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Author } from "./Author";

@Entity()
@ObjectType()
export class Book extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ nullable: true})
  title!: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPublished!: boolean;

  @Field(() => Number)
  @Column()
  authorId!: number;

  @Field(() => Author, { nullable: true })
  @ManyToOne(() => Author, author => author.books)
  public author?: Author

}