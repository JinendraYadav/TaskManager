
import axios from 'axios';

interface EmailParams {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export const emailService = {
  // Send a generic email
  sendEmail: async (params: EmailParams) => {
    try {
      const response = await axios.post('/api/email/send', params);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
  
  // Send a password reset email
  sendPasswordResetEmail: async (email: string, resetToken: string) => {
    const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    return emailService.sendEmail({
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
  },
  
  // Send a notification email when user is tagged in a task
  sendTaskMentionEmail: async (email: string, mentionerName: string, taskTitle: string, taskId: string) => {
    const taskUrl = `${window.location.origin}/tasks/${taskId}`;
    
    return emailService.sendEmail({
      to: email,
      subject: `${mentionerName} mentioned you in a task`,
      html: `
        <h1>You were mentioned in a task</h1>
        <p><strong>${mentionerName}</strong> mentioned you in the task: <strong>${taskTitle}</strong></p>
        <p>Click the link below to view the task:</p>
        <a href="${taskUrl}">View Task</a>
      `,
      text: `${mentionerName} mentioned you in the task: ${taskTitle}. View it at: ${taskUrl}`
    });
  },
  
  // Send welcome email
  sendWelcomeEmail: async (email: string, name: string) => {
    return emailService.sendEmail({
      to: email,
      subject: 'Welcome to Task Manager',
      html: `
        <h1>Welcome to Task Manager!</h1>
        <p>Hello ${name},</p>
        <p>Thank you for joining Task Manager. We're excited to have you on board!</p>
        <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
        <p>Best regards,<br>The Task Manager Team</p>
      `,
      text: `Welcome to Task Manager! Hello ${name}, Thank you for joining Task Manager. We're excited to have you on board! If you have any questions, please don't hesitate to reach out to our support team. Best regards, The Task Manager Team`
    });
  }
};
