import sgMail from '@sendgrid/mail';
import { config } from '../config/env.js';

sgMail.setApiKey(config.sendGridApiKey);

export async function sendNotificationEmail(to, subject, text) {
  const msg = {
    to,
    from: config.sendGridEmailFrom,
    subject,
    text,
    html: `<p>${text}</p>`, // Optional HTML content
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}