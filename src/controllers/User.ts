import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "../models/User";
import { PostModel } from "../models/Post";
import { CommentModel } from "../models/Comment";
import { BadRequestError, NotFoundError } from "../utils/ErrorHandling";

const sanitizeUser = (user: any) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  bio: user.bio,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, bio } = req.body ?? {};
  if (!username || !email || !password) return BadRequestError(res, "username, email and password are required");

  const exists = await UserModel.findOne({ $or: [{ username }, { email: String(email).toLowerCase() }] }).lean();
  if (exists) return res.status(409).json({ error: "username or email already in use" });

  const passwordHash = await bcrypt.hash(String(password), 10);
  const created = await UserModel.create({ username, email, passwordHash, bio: bio ?? "" });
  return res.status(201).json(sanitizeUser(created));
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 }).lean();
  return res.json(users.map(sanitizeUser));
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) return BadRequestError(res, "Invalid userId");

  const user = await UserModel.findById(userId).lean();
  if (!user) return NotFoundError(res, "User not found");
  return res.json(sanitizeUser(user));
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) return BadRequestError(res, "Invalid userId");

  const { username, email, bio, password } = req.body ?? {};
  if (!username && !email && bio === undefined && !password) return BadRequestError(res, "At least one field to update is required");

  const updates: any = {};
  if (username) updates.username = username;
  if (email) updates.email = String(email).toLowerCase();
  if (bio !== undefined) updates.bio = bio;
  if (password) updates.passwordHash = await bcrypt.hash(String(password), 10);

  try {
    const updated = await UserModel.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    if (!updated) return NotFoundError(res, "User not found");
    return res.json(sanitizeUser(updated));
  } catch (e: any) {
    if (e?.code === 11000) return res.status(409).json({ error: "username or email already in use" });
    throw e;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) return BadRequestError(res, "Invalid userId");

  const deleted = await UserModel.findByIdAndDelete(userId);
  if (!deleted) return NotFoundError(res, "User not found");

  const posts = await PostModel.find({ senderId: userId }).select({ _id: 1 }).lean();
  const postIds = posts.map((p) => p._id);
  if (postIds.length) await CommentModel.deleteMany({ postId: { $in: postIds } });
  await PostModel.deleteMany({ senderId: userId });
  await CommentModel.deleteMany({ senderId: userId });

  return res.status(204).send();
};
