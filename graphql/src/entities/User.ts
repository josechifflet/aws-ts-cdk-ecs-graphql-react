import { Entity, BaseEntity, Column, PrimaryColumn,  } from "typeorm";
import { ObjectType, Field, Int, ID } from "type-graphql";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @Column({ generated: "uuid" })
  id!: string;

  @Field(() => Int)
  @PrimaryColumn()
  email!: string;

  @Field(() => String)
  @Column({ nullable: false })
  password!: string;

}
