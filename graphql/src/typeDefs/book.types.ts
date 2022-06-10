import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateBookInput {
  @Field({nullable: true})
  title!: string;

  @Field(() => Int)
  authorId!: number;

  @Field({ nullable: true })
  isPublished?: boolean;
}
@InputType()
export class UpdateBookInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  authorId?: number;

  @Field({ nullable: true })
  isPublished?: boolean;
}