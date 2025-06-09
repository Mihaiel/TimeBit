import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected with authentication
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         category:
 *           type: string
 *           enum: [study, health, work, hobby]
 *         description:
 *           type: string
 *         weekly_hours:
 *           type: number
 *           minimum: 1
 *           maximum: 168
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [ongoing, finished]
 *         notify:
 *           type: boolean
 *         user_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ongoing:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 finished:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', getProjects);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - weekly_hours
 *               - start_date
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [study, health, work, hobby]
 *               description:
 *                 type: string
 *               weekly_hours:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 168
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               notify:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', createProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [study, health, work, hobby]
 *               description:
 *                 type: string
 *               weekly_hours:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 168
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               notify:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [ongoing, finished]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteProject);

export default router; 