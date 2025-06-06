import { sendNotificationEmail } from '../utils/emailService.js';

export async function saveTimeEntryNotification(req, res) {
    try {
        const { userEmail, timeEntryData } = req.body;

        if (!userEmail || !timeEntryData) {
            return res.status(400).json({ error: 'Missing required fields: userEmail, timeEntryData' });
        }

        const subject = 'New Time Entry Registered';
        const text = `A new time entry has been registered:\n\n${JSON.stringify(timeEntryData, null, 2)}`;

        await sendNotificationEmail(userEmail, subject, text);
        res.status(200).json({ message: 'Notification email sent successfully' });
    } catch (error) {
        console.error('Error sending notification email:', error);
        res.status(500).json({ error: 'Failed to send notification email' });
    }
}