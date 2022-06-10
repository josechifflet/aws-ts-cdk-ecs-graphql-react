import { ApolloError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";
import { logError, logInfo } from "../helpers/logger";

export const gqlLogMiddleware: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  try {
    await next();
    const resolveTime = Date.now() - start;
    const log = {
      operation: info.fieldName.toString(),
      operationType: info.operation.operation,
      unixStartTime: start,
      executionTime: resolveTime,
    };
    logInfo(log, "GraphQLLogger");
  } catch (err) {
    logError(err, "Error");
    throw new ApolloError(err as string);
  }
};
