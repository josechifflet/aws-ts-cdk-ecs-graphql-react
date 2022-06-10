import { ApolloError } from "apollo-server-errors";
import { Request, Response } from "express";
import { encodeSession } from ".";
import { config } from "../../config";
import { SessionResult } from "../../entities/Session";
import { User } from "../../entities/User";
import { encrypt } from "./encrypt";

export const loginRest =  async (req: Request, res: Response) => {
    const userResult = await User.findOne({ where: { email: req.body.email, password: encrypt(req.body.password) }}) 

    if (!userResult) return res.status(401).json({
        ok: false,
        status: 401,
        message: "Invalid credentials"
    });

    const session = encodeSession(config.jwtSecretKey!, {
        ...userResult,
        dateCreated: Date.now()      
    });
    
    return res.status(201).json(session);
}

export const loginGraphQL = async (email: string, password: string) => {
    const userResult = await User.findOne({ where: { email, password: encrypt(password) }}) 
    if (!userResult) throw new ApolloError("Invalid credentials")
    const session = encodeSession(config.jwtSecretKey!, {
        ...userResult,
        dateCreated: Date.now()
    });
    return session as SessionResult;
}