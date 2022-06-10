import { ExpirationStatus } from "aws-sdk/clients/s3";
import { Request, Response, NextFunction } from "express";
import { config } from "../../config";
import { Context, DecodeResult, Session } from "./types";
import { checkExpirationStatus } from "./checkExpirationStatus";
import { decodeSession } from "./decodeSession";
import { encodeSession } from "./encodeSession";
import { AuthChecker } from "type-graphql";

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export const jwtMiddleware =
  (loginRequired: boolean) =>
  (request: Request, response: Response, next: NextFunction) => {
    const unauthorized = (message: string) =>
      response.status(401).json({
        ok: false,
        status: 401,
        message: message,
      });

    const requestHeader = "X-JWT-Token";
    const responseHeader = "X-Renewed-JWT-Token";
    const header = request.header(requestHeader);

    if (!header) {
      if (loginRequired) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
      }
      next();
      return;
    }

    const decodedSession: DecodeResult = decodeSession(
      config.jwtSecretKey!,
      header
    );

    if (
      decodedSession.type === "integrity-error" ||
      decodedSession.type === "invalid-token"
    ) {
      if (loginRequired) {
        unauthorized(
          `Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`
        );
        return;
      }
      next();
      return;
    }

    const expiration: ExpirationStatus = checkExpirationStatus(
      decodedSession.session
    );

    if (expiration === "expired") {
      if (loginRequired) {
        unauthorized(
          `Authorization token has expired. Please create a new authorization token.`
        );
        return;
      }
      next();
      return;
    }

    let session: Session;

    if (expiration === "grace") {
      // Automatically renew the session and send it back with the response
      const { token, expires, issued } = encodeSession(
        config.jwtSecretKey!,
        decodedSession.session
      );
      session = {
        ...decodedSession.session,
        expires: expires,
        issued: issued,
      };

      response.setHeader(responseHeader, token);
    } else {
      session = decodedSession.session;
    }

    // Set the session on response.locals object for routes to access
    response.locals = {
      ...response.locals,
      session,
    };

    // Set req for use user in next auth middlewares
    request.user = session;

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
  };

export const customAuthChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles
) => {
  return !!context.user; // or false if access is denied
};
