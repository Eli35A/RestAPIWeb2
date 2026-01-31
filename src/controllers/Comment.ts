import { Request, Response } from "express";
import mongoose from "mongoose";
import { CommentModel } from "../models/Comment";
import { PostModel } from "../models/Post";
import { UserModel } from "../models/User";
import { AuthedRequest } from "../middleware/AuthMiddleware";
import { BadRequestError, NotFoundError } from "../utils/ErrorHandling";

export const createComment = async (req: AuthedRequest, res: Response) => {
  const postId = (req.params.postId as string | undefined) ?? (req.body?.postId as string | undefined);
  const senderId = req.user?.id;
  const { message } = req.body ?? {};
  if (!senderId) return res.status(401).json({ error: "Missing access token" });
  if (!postId || !message) return BadRequestError(res, "postId and message are required");
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const doesPostExist = await PostModel.exists({ _id: postId });
  if (!doesPostExist) return NotFoundError(res, "Post not found for this postId");

  const doesUserExist = await UserModel.exists({ _id: senderId });
  if (!doesUserExist) return NotFoundError(res, "User not found");

  const created = await CommentModel.create({ postId, senderId, message });
  return res.status(201).json(created);
}

export const getAllComments = async (req: Request, res: Response) => {
  const comments = await CommentModel.find().sort({ createdAt: -1 }).lean();
  return res.json(comments);
}

export const getCommentById = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) return BadRequestError(res, "Invalid commentId");

  const comment = await CommentModel.findById(commentId).lean();
  if (!comment) return NotFoundError(res, "Comment not found");

  return res.json(comment);
}

export const updateComment = async (req: AuthedRequest, res: Response) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) return BadRequestError(res, "Invalid commentId");

  const { postId, message } = req.body ?? {};
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Missing access token" });
  if (!postId || !message) return BadRequestError(res, "postId and message are required");
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const doesPostExist = await PostModel.exists({ _id: postId });
  if (!doesPostExist) return NotFoundError(res, "Post not found for given postId");

  const existing = await CommentModel.findById(commentId).lean();
  if (!existing) return NotFoundError(res, "Comment not found");
  if (existing.senderId.toString() !== userId) return res.status(403).json({ error: "Not allowed" });

  const updated = await CommentModel.findByIdAndUpdate(commentId, { postId, message }, { new: true, runValidators: true });

  if (!updated) return NotFoundError(res, "Comment not found");
  return res.json(updated);
}

export const deleteComment = async (req: AuthedRequest, res: Response) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) return BadRequestError(res, "Invalid commentId");

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Missing access token" });

  const existing = await CommentModel.findById(commentId).lean();
  if (!existing) return NotFoundError(res, "Comment not found");
  if (existing.senderId.toString() !== userId) return res.status(403).json({ error: "Not allowed" });

  const deleted = await CommentModel.findByIdAndDelete(commentId);
  if (!deleted) return NotFoundError(res, "Comment not found");

  return res.status(204).send();
}

export const getCommentsForPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const doesPostExist = await PostModel.exists({ _id: postId });
  if (!doesPostExist) return NotFoundError(res, "Post not found");

  const comments = await CommentModel.find({ postId }).sort({ createdAt: -1 }).lean();
  return res.json(comments);
}
