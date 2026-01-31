import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/User";
import { BadRequestError, NotFoundError } from "../utils/ErrorHandling";

export const createUser = async (req: Request, res: Response) => {
  const { username, email } = req.body ?? {};
  if (!username || !email) return BadRequestError(res, "username and email are required");

  const created = await UserModel.create({ username, email });
  return res.status(201).json(created);
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 }).lean();
  return res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) return BadRequestError(res, "Invalid userId");

  const user = await UserModel.findById(userId).lean();
  if (!user) return NotFoundError(res, "User not found");

  return res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) return BadRequestError(res, "Invalid userId");

  const { username, email } = req.body ?? {};
  if (!username || !email) return BadRequestError(res, "username and email are required");

  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { username, email },
    { new: true, overwrite: true, runValidators: true }
  );

  if (!updated) return NotFoundError(res, "User not found");
  return res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) return BadRequestError(res, "Invalid userId");

  const deleted = await UserModel.findByIdAndDelete(userId);
  if (!deleted) return NotFoundError(res, "User not found");

  return res.status(204).send();
};
