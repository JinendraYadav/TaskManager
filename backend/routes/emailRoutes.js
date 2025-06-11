
import { Router } from 'express';
import { sendEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService.js';
import auth from '../middleware/auth.js';

const router = Router();

// Protected route for sending general emails (requires authentication)
router.post('/send', auth, async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const result = await sendEmail({ to, subject, html, text });
    res.json(result);
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

// Public route for requesting password reset (no authentication required)
router.post('/password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Generate a reset token (this would be stored in the database in a real implementation)
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    // Get base URL from request
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Send the password reset email
    await sendPasswordResetEmail(email, resetToken, baseUrl);
    
    // For security reasons, always return success even if the email doesn't exist
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Password reset email error:', error);
    // For security, don't expose error details
    res.status(500).json({ message: 'Error processing password reset request' });
  }
});

// Protected route for sending welcome emails (admin only in a real implementation)
router.post('/welcome', auth, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }
    
    const result = await sendWelcomeEmail(email, name);
    res.json(result);
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ message: 'Error sending welcome email', error: error.message });
  }
});

export default router;
