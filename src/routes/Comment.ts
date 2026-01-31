import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from "../controllers/Comment";
import { requireAuth } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @openapi
 * /comments:
 *   post:
 *     summary: Create a comment (requires login)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [postId, message]
 *             properties:
 *               postId: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", requireAuth, createComment);

/**
 * @openapi
 * /comments:
 *   get:
 *     summary: List all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getAllComments);

/**
 * @openapi
 * /comments/{commentId}:
 *   get:
 *     summary: Get comment by id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:commentId", getCommentById);

/**
 * @openapi
 * /comments/{commentId}:
 *   put:
 *     summary: Update comment (owner only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [postId, message]
 *             properties:
 *               postId: { type: string }
 *               message: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:commentId", requireAuth, updateComment);

/**
 * @openapi
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete comment (owner only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: No Content
 */
router.delete("/:commentId", requireAuth, deleteComment);

export default router;
