import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { SessionResult } from "../entities/Session";

import { MeInput } from "../typeDefs/me.types";
import { loginGraphQL } from "../utils/auth/login";
import { signupGraphQl } from "../utils/auth/signup";

import { gqlLogMiddleware } from "../utils/middlewares/gqlLogMiddleware";

@Resolver()
export class MeResolver {
  @Mutation(() => SessionResult)
  @UseMiddleware([gqlLogMiddleware])
  async signup(@Arg("data") me: MeInput): Promise<SessionResult> {
    const result = await signupGraphQl(me.email, me.password);
    return result;
  }
  @Mutation(() => SessionResult)
  @UseMiddleware([gqlLogMiddleware])
  async login(@Arg("data") me: MeInput): Promise<SessionResult> {
    const result = await loginGraphQL(me.email, me.password);
    return result;
  }

}
