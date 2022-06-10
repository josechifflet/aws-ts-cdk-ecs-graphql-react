import { ClassType, Field, ObjectType, Int } from "type-graphql";

export default function PaginatedResponse<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue> | String | Number | Boolean,
) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [itemsFieldValue])
    items!: TItemsFieldValue[];

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    skip!: number;

    @Field(() => Int)
    count!: number;
  }
  return PaginatedResponseClass;
}