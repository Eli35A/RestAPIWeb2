import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from "../controllers/Comment";

const router = Router();

router.post("/", createComment);
router.get("/", getAllComments);
router.get("/:commentId", getCommentById);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
