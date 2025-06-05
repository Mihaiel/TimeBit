import sgMail from '@sendgrid/mail';
import { config } from '../config/env.js';

sgMail.setApiKey(config.SENDGRID_API_KEY);

export async function sendNotificationEmail(to, subject, text) {
  const msg = {
    to,
    from: config.SENDGRID_FROM_EMAIL,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}