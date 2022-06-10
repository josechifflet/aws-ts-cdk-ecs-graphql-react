import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SessionResult {
  @Field()
  token!: string;

  @Field()
  expires!: number;

  @Field()
  issued!: number;
}
