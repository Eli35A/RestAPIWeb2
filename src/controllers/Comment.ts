import { Request, Response } from "express";
import mongoose from "mongoose";
import { CommentModel } from "../models/Comment";
import { PostModel } from "../models/Post";
import { BadRequestError, NotFoundError } from "../utils/ErrorHandling";

export const createComment = async (req: Request, res: Response) => {
  const { postId, senderId, message } = req.body ?? {};
  if (!postId || !senderId || !message) return BadRequestError(res, "postId, senderId and message are required");
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const doesPostExist = await PostModel.exists({ _id: postId });
  if (!doesPostExist) return NotFoundError(res, "Post not found for this postId");

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

export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) return BadRequestError(res, "Invalid commentId");

  const { postId, senderId, message } = req.body ?? {};
  if (!postId || !senderId || !message) return BadRequestError(res, "postId, senderId and message are required");
  if (!mongoose.isValidObjectId(postId)) return BadRequestError(res, "Invalid postId");

  const doesPostExist = await PostModel.exists({ _id: postId });
  if (!doesPostExist) return NotFoundError(res, "Post not found for given postId");

  const updated = await CommentModel.findByIdAndUpdate(
    commentId,
    { postId, senderId, message },
    { new: true, overwrite: true, runValidators: true }
  );

  if (!updated) return NotFoundError(res, "Comment not found");
  return res.json(updated);
}

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) return BadRequestError(res, "Invalid commentId");

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
