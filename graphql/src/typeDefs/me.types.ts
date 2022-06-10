import { InputType, Field } from "type-graphql";

@InputType()
export class MeInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

}
