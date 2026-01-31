import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "../models/User";
import { BadRequestError, NotFoundError } from "../utils/ErrorHandling";
import { durationToMs } from "../utils/Time";
import { hashTokenId, randomTokenId, signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/Auth";

const refreshDefaultMs = 7 * 24 * 60 * 60 * 1000; // 7 days

const buildTokensForUser = async (userId: mongoose.Types.ObjectId, username: string) => {
  const tokenId = randomTokenId();
  const refreshToken = signRefreshToken(userId.toString(), tokenId);
  const accessToken = signAccessToken(userId.toString(), username);

  const refreshMs = durationToMs(process.env.REFRESH_TOKEN_EXPIRES_IN || "7d", refreshDefaultMs);
  const expiresAt = new Date(Date.now() + refreshMs);

  await UserModel.updateOne(
    { _id: userId },
    { $set: { refreshTokens: [{ tokenIdHash: hashTokenId(tokenId), expiresAt, createdAt: new Date() }] } }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password, bio } = req.body ?? {};
  if (!username || !email || !password) return BadRequestError(res, "username, email and password are required");

  const existing = await UserModel.findOne({ $or: [{ username }, { email: String(email).toLowerCase() }] }).lean();
  if (existing) return res.status(409).json({ error: "username or email already in use" });

  const passwordHash = await bcrypt.hash(String(password), 10);
  const created = await UserModel.create({ username, email, passwordHash, bio: bio ?? "" });

  const tokens = await buildTokensForUser(created._id, created.username);
  return res.status(201).json({ user: { id: created._id, username: created.username, email: created.email, bio: created.bio }, ...tokens });
};

export const login = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body ?? {};
  if (!emailOrUsername || !password) return BadRequestError(res, "emailOrUsername and password are required");

  const user = await UserModel.findOne({
    $or: [{ email: String(emailOrUsername).toLowerCase() }, { username: String(emailOrUsername) }],
  });
  if (!user) return NotFoundError(res, "Invalid credentials");

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) return NotFoundError(res, "Invalid credentials");

  const tokens = await buildTokensForUser(user._id, user.username);
  return res.json({ user: { id: user._id, username: user.username, email: user.email, bio: user.bio }, ...tokens });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) return BadRequestError(res, "refreshToken is required");

  try {
    const payload = verifyRefreshToken(String(refreshToken));
    const user = await UserModel.findById(payload.sub);
    if (!user) return NotFoundError(res, "User not found");

    const stored = user.refreshTokens?.[0];
    if (!stored) return res.status(401).json({ error: "Refresh token revoked" });
    if (stored.expiresAt.getTime() < Date.now()) return res.status(401).json({ error: "Refresh token expired" });
    if (stored.tokenIdHash !== hashTokenId(payload.tid)) return res.status(401).json({ error: "Refresh token revoked" });

    const tokens = await buildTokensForUser(user._id, user.username);
    return res.json(tokens);
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) return BadRequestError(res, "refreshToken is required");

  try {
    const payload = verifyRefreshToken(String(refreshToken));
    await UserModel.updateOne({ _id: payload.sub }, { $set: { refreshTokens: [] } });
  } catch {
    // even if invalid token, we return 204
  }

  return res.status(204).send();
};
