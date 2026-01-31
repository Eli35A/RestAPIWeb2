import { Router } from "express";
import { addPost, getPostById, getPosts, updatePost } from "../controllers/Post";
import { getCommentsForPost } from "../controllers/Comment";

const router = Router();

router.post("/", addPost);
router.get("/", getPosts);
router.get("/:postId", getPostById);
router.put("/:postId", updatePost);
router.get("/:postId/comments", getCommentsForPost);

export default router;
