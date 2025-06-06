import express from 'express';
import { sendNotificationEmail } from '../utils/emailService.js';
import { saveTimeEntryNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/time-entry', saveTimeEntryNotification);

router.post('/send-notification', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, text' });
  }

  try {
    await sendNotificationEmail(to, subject, text);
    res.status(200).json({ message: 'Notification email sent successfully' });
  } catch (error) {
    console.error('Error sending notification email:', error);
    res.status(500).json({ error: 'Failed to send notification email' });
  }
});

export default router;