import sgMail from '@sendgrid/mail';
import { config } from '../config/env.js';

sgMail.setApiKey(config.sendGridApiKey);

export async function sendNotificationEmail(to, subject, text, html) {
  const msg = {
    to,
    from: config.sendGridEmailFrom,
    subject,
    text,
    html: html || `<p>${text}</p>`, // Use provided HTML or fallback to simple text
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}