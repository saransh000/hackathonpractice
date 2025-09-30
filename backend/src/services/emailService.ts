import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { IUser } from '../models/User';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      // For development - use Ethereal email (fake SMTP)
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
      },
      // For production, use services like SendGrid, Mailgun, etc.
      // service: 'SendGrid',
      // auth: {
      //   user: 'apikey',
      //   pass: process.env.SENDGRID_API_KEY
      // }
    });
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"Hackathon Helper" <${process.env.FROM_EMAIL || 'noreply@hackathonhelper.com'}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent:', info.messageId);
      
      // Log preview URL for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user: IUser, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - Hackathon Helper</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name}!</h2>
            <p>We received a request to reset your password for your Hackathon Helper account.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in <strong>10 minutes</strong></li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${resetUrl}
            </p>
            
            <hr style="margin: 30px 0;">
            <p><strong>Account Details:</strong></p>
            <ul>
              <li>Email: ${user.email}</li>
              <li>Account Type: ${user.role}</li>
              <li>Request Time: ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <div class="footer">
            <p>🚀 Hackathon Helper Team<br>
            Making hackathons more organized, one task at a time!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request - Hackathon Helper
      
      Hi ${user.name}!
      
      We received a request to reset your password for your Hackathon Helper account.
      
      Reset your password by clicking this link: ${resetUrl}
      
      ⚠️ Security Notice:
      - This link will expire in 10 minutes
      - If you didn't request this reset, please ignore this email
      - Never share this link with anyone
      
      Account Details:
      - Email: ${user.email}
      - Account Type: ${user.role}
      - Request Time: ${new Date().toLocaleString()}
      
      🚀 Hackathon Helper Team
      Making hackathons more organized, one task at a time!
    `;

    await this.sendEmail({
      to: user.email,
      subject: '🔐 Reset Your Hackathon Helper Password',
      text,
      html
    });
  }

  /**
   * Send task assignment notification
   */
  async sendTaskAssignmentEmail(assignee: IUser, task: any, assigner: IUser): Promise<void> {
    const taskUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/board/${task.board}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Task Assignment - Hackathon Helper</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4facfe; }
          .button { display: inline-block; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .priority-high { border-left-color: #e74c3c; }
          .priority-medium { border-left-color: #f39c12; }
          .priority-low { border-left-color: #27ae60; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Task Assignment</h1>
          </div>
          <div class="content">
            <h2>Hi ${assignee.name}!</h2>
            <p>${assigner.name} has assigned you a new task in Hackathon Helper.</p>
            
            <div class="task-card priority-${task.priority || 'medium'}">
              <h3>📝 ${task.title}</h3>
              <p><strong>Description:</strong> ${task.description || 'No description provided'}</p>
              <p><strong>Priority:</strong> ${task.priority ? task.priority.toUpperCase() : 'MEDIUM'}</p>
              <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
              <p><strong>Status:</strong> ${task.status || 'pending'}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${taskUrl}" class="button">View Task Board</a>
            </div>
            
            <p>Get organized and start collaborating with your team!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: assignee.email,
      subject: `📋 New Task: ${task.title} - Hackathon Helper`,
      html
    });
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(user: IUser): Promise<void> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/login`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Hackathon Helper!</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .feature { background: white; padding: 15px; border-radius: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Hackathon Helper!</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name}!</h2>
            <p>Welcome to the ultimate hackathon organization tool! We're excited to help you manage your projects more effectively.</p>
            
            <div class="features">
              <div class="feature">
                <h3>📋 Kanban Boards</h3>
                <p>Organize tasks visually</p>
              </div>
              <div class="feature">
                <h3>👥 Team Collaboration</h3>
                <p>Work together seamlessly</p>
              </div>
              <div class="feature">
                <h3>⚡ Real-time Updates</h3>
                <p>Stay synchronized</p>
              </div>
              <div class="feature">
                <h3>📊 Progress Tracking</h3>
                <p>Monitor your success</p>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">Start Organizing Now</a>
            </div>
            
            <p>Ready to make your hackathon experience amazing? Let's get started!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: '🎉 Welcome to Hackathon Helper - Let\'s Get Organized!',
      html
    });
  }

  /**
   * Generate password reset token
   */
  generateResetToken(): { token: string; hashedToken: string } {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
  }
}

// Export singleton instance
export const emailService = new EmailService();