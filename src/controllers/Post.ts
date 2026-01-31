import { Request, Response } from "express";
import mongoose from "mongoose";
import { PostModel } from "../models/Post";
import { UserModel } from "../models/User";
import { BadRequestError, NotFoundError } from "../utils/ErrorHandling";

export const addPost = async (req: Request, res: Response) => {
  const { senderId, message } = req.body ?? {};
  if (!senderId || !message) return BadRequestError(res, "senderId and message are required");

  const doesUserExist = await UserModel.exists({ _id: senderId });
  if (!doesUserExist) return NotFoundError(res, "User not found for this senderId");

  const created = await PostModel.create({ senderId, message });
  return res.status(201).json(created);
}

export const getPosts = async (req: Request, res: Response) => {
  const senderId = req.query.senderId as string | undefined;

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

export const updatePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const { senderId, message } = req.body ?? {};
  if (!senderId || !message) return BadRequestError(res, "senderId and message are required");

  const updated = await PostModel.findByIdAndUpdate(
    postId,
    { senderId, message },
    { new: true, overwrite: true, runValidators: true }
  );

  if (!updated) return NotFoundError(res, "Post not found");
  return res.json(updated);
}
