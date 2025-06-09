import { sendNotificationEmail } from '../utils/emailService.js';

export async function sendProjectCreationNotification(userEmail, projectData) {
    try {
        const { title, category, description, weekly_hours, start_date, end_date } = projectData;
        
        const subject = 'New Project Created';
        const text = `Your project "${title}" has been successfully created!`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #333;">New Project Created!</h2>
                <p>Your project "<strong>${title}</strong>" has been successfully created.</p>
                
                <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                    <p><strong>Category:</strong> ${category}</p>
                    <p><strong>Weekly Hours:</strong> ${weekly_hours}</p>
                    <p><strong>Start Date:</strong> ${new Date(start_date).toLocaleDateString()}</p>
                    ${end_date ? `<p><strong>End Date:</strong> ${new Date(end_date).toLocaleDateString()}</p>` : ''}
                    ${description ? `<p><strong>Description:</strong><br>${description}</p>` : ''}
                </div>
                
                <p>You can view and manage your project in the TimeBit app.</p>
                
                <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
                    This is an automated message from TimeBit. Please do not reply to this email.
                </p>
            </div>
        `;

        await sendNotificationEmail(userEmail, subject, text, html);
        return true;
    } catch (error) {
        console.error('Error sending project creation notification:', error);
        throw error;
    }
}