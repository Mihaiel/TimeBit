import express from 'express';
import { createTimeEntry, getTimeEntries, updateTimeEntry } from '../controllers/timeEntryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected with authentication
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     TimeEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The time entry ID
 *         user_id:
 *           type: integer
 *           description: The user ID who created the time entry
 *         project_id:
 *           type: integer
 *           description: The project ID associated with the time entry
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the time entry
 *         start_time:
 *           type: string
 *           format: time
 *           description: The start time of the entry
 *         end_time:
 *           type: string
 *           format: time
 *           description: The end time of the entry
 *         minutes:
 *           type: integer
 *           description: Total minutes between start and end time
 *         notes:
 *           type: string
 *           description: Additional notes about the time entry
 */

/**
 * @swagger
 * /time-entry:
 *   post:
 *     tags: [Time Entries]
 *     summary: Create a new time entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *               - date
 *               - start_time
 *               - end_time
 *             properties:
 *               project_id:
 *                 type: integer
 *                 description: ID of the project
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the time entry (YYYY-MM-DD)
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time (HH:mm)
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time (HH:mm)
 *               notes:
 *                 type: string
 *                 description: Optional notes for the time entry
 *     responses:
 *       201:
 *         description: Time entry created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', createTimeEntry);

/**
 * @swagger
 * /time-entry:
 *   get:
 *     tags: [Time Entries]
 *     summary: Get time entries for a date range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of time entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   project_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   start_time:
 *                     type: string
 *                     format: time
 *                   end_time:
 *                     type: string
 *                     format: time
 *                   minutes:
 *                     type: integer
 *                   notes:
 *                     type: string
 *                   Project:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', getTimeEntries);

/**
 * @swagger
 * /time-entry/{id}:
 *   patch:
 *     tags: [Time Entries]
 *     summary: Update an existing time entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Time entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *               - date
 *               - start_time
 *               - end_time
 *             properties:
 *               project_id:
 *                 type: integer
 *                 description: ID of the project
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the time entry (YYYY-MM-DD)
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time (HH:mm)
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time (HH:mm)
 *               notes:
 *                 type: string
 *                 description: Optional notes for the time entry
 *     responses:
 *       200:
 *         description: Time entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 project_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date
 *                 start_time:
 *                   type: string
 *                   format: time
 *                 end_time:
 *                   type: string
 *                   format: time
 *                 minutes:
 *                   type: integer
 *                 notes:
 *                   type: string
 *                 Project:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Time entry not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateTimeEntry);

export default router; 