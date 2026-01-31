import { Router } from "express";
import { addPost, deletePost, getPostById, getPosts, updatePost } from "../controllers/Post";
import { createComment, getCommentsForPost } from "../controllers/Comment";
import { requireAuth } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Create a new post (requires login)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string, example: "Hello world" }
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", requireAuth, addPost);

/**
 * @openapi
 * /posts:
 *   get:
 *     summary: List posts (optional filter by sender)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema: { type: string }
 *         description: Sender user id
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getPosts);

/**
 * @openapi
 * /posts/{postId}:
 *   get:
 *     summary: Get a post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:postId", getPostById);

/**
 * @openapi
 * /posts/{postId}:
 *   put:
 *     summary: Update a post (owner only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:postId", requireAuth, updatePost);

/**
 * @openapi
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post (owner only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: No Content
 */
router.delete("/:postId", requireAuth, deletePost);

/**
 * @openapi
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:postId/comments", getCommentsForPost);

/**
 * @openapi
 * /posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post (requires login)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/:postId/comments", requireAuth, createComment);

export default router;
