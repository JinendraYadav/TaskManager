
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

// Create a transporter object using SMTP transport
let transporter;

// Setup email transporter based on environment
if (process.env.NODE_ENV === 'production') {
  // Production email setup
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Development email setup (using Ethereal for testing)
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_EMAIL || 'example@ethereal.email',
      pass: process.env.ETHEREAL_PASSWORD || 'examplepassword',
    },
  });
}

// Function to send an email
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Validate inputs
    if (!to || (!html && !text)) {
      throw new Error('Missing required email parameters');
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Task Manager <no-reply@task.com>',
      to,
      subject,
      html,
      text
    };

    // Send email and return result
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);

    // For development/testing, log preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to send a welcome email
export const sendWelcomeEmail = async (email, name) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Zidio',
    html: `
      <h1>Welcome to Zidio!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for joining Zidio. We're excited to have you on board!</p>
      <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
      <p>Best regards,<br>The Zidio Team</p>
    `,
    text: `Welcome to Zidio! Hello ${name}, Thank you for joining Zidio. We're excited to have you on board! If you have any questions, please don't hesitate to reach out to our support team. Best regards, The Zidio Team`
  });
};

// Function to send a password reset email
export const sendPasswordResetEmail = async (email, resetToken, baseUrl) => {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
    text: `Password Reset: You requested a password reset. Please visit ${resetUrl} to reset your password. If you didn't request this, please ignore this email. This link will expire in 1 hour.`
  });
};
