import { Request, Response } from "express";
import mongoose from "mongoose";
import { PostModel } from "../models/Post";
import { CommentModel } from "../models/Comment";
import { UserModel } from "../models/User";
import { AuthedRequest } from "../middleware/AuthMiddleware";
import { BadRequestError, NotFoundError } from "../utils/ErrorHandling";

export const addPost = async (req: AuthedRequest, res: Response) => {
  const { message } = req.body ?? {};
  const senderId = req.user?.id;
  if (!senderId) return res.status(401).json({ error: "Missing access token" });
  if (!message) return BadRequestError(res, "message is required");

  const doesUserExist = await UserModel.exists({ _id: senderId });
  if (!doesUserExist) return NotFoundError(res, "User not found");

  const created = await PostModel.create({ senderId, message });
  return res.status(201).json(created);
}

export const getPosts = async (req: Request, res: Response) => {
  const senderId = (req.query.senderId as string | undefined) ?? (req.query.sender as string | undefined);

  const filter = senderId ? { senderId } : {};
  const posts = await PostModel.find(filter).sort({ createdAt: -1 }).lean();
  return res.json(posts);
}

export const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const post = await PostModel.findById(postId).lean();
  if (!post) return NotFoundError(res, "Post not found");

  return res.json(post);
}

export const updatePost = async (req: AuthedRequest, res: Response) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const { message } = req.body ?? {};
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Missing access token" });
  if (!message) return BadRequestError(res, "message is required");

  const existing = await PostModel.findById(postId).lean();
  if (!existing) return NotFoundError(res, "Post not found");
  if (existing.senderId.toString() !== userId) return res.status(403).json({ error: "Not allowed" });

  const updated = await PostModel.findByIdAndUpdate(postId, { message }, { new: true, runValidators: true });
  return res.json(updated);
}

export const deletePost = async (req: AuthedRequest, res: Response) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Missing access token" });

  const existing = await PostModel.findById(postId).lean();
  if (!existing) return NotFoundError(res, "Post not found");
  if (existing.senderId.toString() !== userId) return res.status(403).json({ error: "Not allowed" });

  await CommentModel.deleteMany({ postId });
  await PostModel.findByIdAndDelete(postId);
  return res.status(204).send();
}
