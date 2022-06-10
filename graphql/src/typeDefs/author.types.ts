import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateAuthorInput {

  @Field()
  name!: string;

  @Field({ nullable: true })
  country?: string;

  @Field(() => Int)
  age!: number;
}

@InputType()
export class UpdateAuthorInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  country?: string;

  @Field(() => Int, { nullable: true })
  age?: number;
}