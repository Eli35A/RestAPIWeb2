import crypto from "crypto";
import jwt from "jsonwebtoken";

export type JwtUserPayload = { sub: string; username?: string };

const accessSecret = process.env.ACCESS_TOKEN_SECRET || "";
const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "";

export const assertJwtSecrets = () => {
  if (!accessSecret || !refreshSecret) {
    throw new Error("Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET in env");
  }
};

export const hashTokenId = (tokenId: string) => {
  return crypto.createHash("sha256").update(tokenId).digest("hex");
};

export const signAccessToken = (userId: string, username?: string) => {
  assertJwtSecrets();
  const payload: JwtUserPayload = { sub: userId, username };
  return jwt.sign(payload, accessSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ? parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10) : "15m" });
};

export const signRefreshToken = (userId: string, tokenId: string) => {
  assertJwtSecrets();
  const payload = { sub: userId, tid: tokenId };
  return jwt.sign(payload, refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10) : "7d" });
};

export const verifyAccessToken = (token: string) => {
  assertJwtSecrets();
  return jwt.verify(token, accessSecret) as JwtUserPayload;
};

export const verifyRefreshToken = (token: string) => {
  assertJwtSecrets();
  return jwt.verify(token, refreshSecret) as { sub: string; tid: string; iat: number; exp: number };
};

export const randomTokenId = () => crypto.randomBytes(32).toString("hex");
