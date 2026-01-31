import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/User";
import { requireAuth } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user (admin-style)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               bio: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", requireAuth, createUser);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", requireAuth, getUsers);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:userId", requireAuth, getUserById);

/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               bio: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:userId", requireAuth, updateUser);

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     summary: Delete user (also deletes their posts/comments)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: No Content
 */
router.delete("/:userId", requireAuth, deleteUser);

export default router;
