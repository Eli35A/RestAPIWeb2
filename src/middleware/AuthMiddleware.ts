import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/Auth";

export type AuthedRequest = Request & { user?: { id: string; username?: string } };

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing access token" });
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, username: payload.username };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};
