import { InputType, Field, Int } from "type-graphql";
import {
  ActionType,
  ChainType,
  ProtocolType,
  TargetType,
} from "../entities/Rule";

@InputType()
export class RuleInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => ChainType)
  chain!: ChainType;

  @Field(() => Int)
  rulenum!: number;

  @Field(() => ActionType)
  action!: ActionType;

  @Field(() => ProtocolType, { nullable: true })
  protocol?: ProtocolType;

  @Field(() => String, { nullable: true })
  src?: string;

  @Field(() => String, { nullable: true })
  dst?: string;

  @Field(() => Int, { nullable: true })
  sport?: number;

  @Field(() => Int, { nullable: true })
  dport?: number;

  @Field(() => String, { nullable: true })
  in?: string;

  @Field(() => String, { nullable: true })
  out?: string;

  @Field(() => TargetType, { nullable: true })
  target?: TargetType;
}
