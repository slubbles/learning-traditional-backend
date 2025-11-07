// ========================================
// EMAIL SERVICE (Resend)
// ========================================
// Handles sending emails via Resend API

const { Resend } = require('resend');
const logger = require('../utils/logger');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * SEND VERIFICATION EMAIL
 * Sends email with verification link to new users
 */
const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your TaskFlow account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { color: white; margin: 0; font-size: 28px; }
              .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .button:hover { background: #5568d3; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              .code { background: #e5e7eb; padding: 10px 15px; border-radius: 5px; font-family: monospace; margin: 15px 0; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to TaskFlow!</h1>
              </div>
              <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thanks for signing up for TaskFlow! We're excited to have you on board.</p>
                <p>To get started, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <div style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px;">
                  ${verificationUrl}
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                  This link will expire in <strong>24 hours</strong>.
                </p>
                
                <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                  If you didn't create an account with TaskFlow, you can safely ignore this email.
                </p>
              </div>
              <div class="footer">
                <p>TaskFlow - Enterprise Task Management</p>
                <p>&copy; 2025 TaskFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Resend API error:', error);
      throw new Error('Failed to send verification email');
    }

    logger.info(`Verification email sent to ${email} (ID: ${data.id})`);
    return data;
    
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * SEND WELCOME EMAIL
 * Sent after user verifies their email
 */
const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to TaskFlow! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { color: white; margin: 0; font-size: 28px; }
              .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Email Verified!</h1>
              </div>
              <div class="content">
                <h2>Welcome aboard, ${name}!</h2>
                <p>Your email has been successfully verified. You're all set to start using TaskFlow!</p>
                
                <p><strong>Here's what you can do now:</strong></p>
                <ul>
                  <li>Create your first project</li>
                  <li>Invite team members</li>
                  <li>Organize tasks and track progress</li>
                  <li>Collaborate with your team in real-time</li>
                </ul>
                
                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
                </div>
              </div>
              <div class="footer">
                <p>TaskFlow - Enterprise Task Management</p>
                <p>&copy; 2025 TaskFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Resend API error:', error);
      throw new Error('Failed to send welcome email');
    }

    logger.info(`Welcome email sent to ${email} (ID: ${data.id})`);
    return data;
    
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
