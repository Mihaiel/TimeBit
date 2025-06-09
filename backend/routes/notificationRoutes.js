import express from 'express';
import { sendNotificationEmail } from '../utils/emailService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected with authentication
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         to:
 *           type: string
 *           format: email
 *           description: Recipient's email address
 *         subject:
 *           type: string
 *           description: Email subject
 *         text:
 *           type: string
 *           description: Plain text content of the email
 *         html:
 *           type: string
 *           description: HTML content of the email (optional)
 */

/**
 * @swagger
 * /api/send-notification:
 *   post:
 *     summary: Send a notification email
 *     tags: [APIs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - text
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Recipient's email address
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               text:
 *                 type: string
 *                 description: Plain text content of the email
 *               html:
 *                 type: string
 *                 description: HTML content of the email (optional)
 *     responses:
 *       200:
 *         description: Notification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification email sent successfully"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields: to, subject, text"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to send notification email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to send notification email"
 */
router.post('/send-notification', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, text' });
  }

  try {
    await sendNotificationEmail(to, subject, text, html);
    res.status(200).json({ message: 'Notification email sent successfully' });
  } catch (error) {
    console.error('Error sending notification email:', error);
    res.status(500).json({ error: 'Failed to send notification email' });
  }
});

export default router;