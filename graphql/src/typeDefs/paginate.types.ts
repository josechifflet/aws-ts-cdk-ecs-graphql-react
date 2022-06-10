import { InputType, Field, Int } from "type-graphql";

@InputType()
export class PaginateInput {
  @Field(() => Int)
  skip!: number;

  @Field(() => Int)
  take!: number;

}
