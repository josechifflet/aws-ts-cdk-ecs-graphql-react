import { ApolloError } from "apollo-server-express";
import { Request, Response } from "express";
import { encodeSession } from ".";
import { config } from "../../config";
import { SessionResult } from "../../entities/Session";
import { User } from "../../entities/User";
import { encrypt } from "./encrypt";

export const signupRest = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let userResult = await User.findOne({ where: { email } });
  if (userResult)
    return res.status(400).json({
      ok: false,
      status: 400,
      message: "User already exists",
    });
  userResult = await User.create({
    email,
    password: encrypt(password),
  }).save();

  const session = encodeSession(config.jwtSecretKey!, {
    ...userResult,
    dateCreated: Date.now(),
  });

  return res.status(201).json(session);
};

export const signupGraphQl = async (email: string, password: string) => {
  let userResult = await User.findOne({ where: { email } });
  if (userResult) throw new ApolloError("User already exists");
  userResult = await User.create({
    email,
    password: encrypt(password),
  }).save();
  const session = encodeSession(config.jwtSecretKey!, {
    ...userResult,
    dateCreated: Date.now(),
  });
  return session as SessionResult;
};
