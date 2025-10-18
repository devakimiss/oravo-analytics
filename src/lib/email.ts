import { createTransport } from 'nodemailer';

const emailEnabled = !!process.env.SMTP_HOST;

const transporter = emailEnabled
  ? createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!emailEnabled || !transporter) {
    console.log('Email not configured. Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Content:', text || html);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@oravo.com',
      to,
      subject,
      html,
      text,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
}

export function generateVerificationEmail(username: string, token: string) {
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #000000 0%, #2a2a2a 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          h1 {
            color: #000000;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .button {
            display: inline-block;
            background: #000000;
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
          }
          .link {
            color: #000000;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Oravo</div>
          <h1>Welcome to Oravo, ${username}! 🎉</h1>
          <p>Thank you for signing up! We're excited to have you on board.</p>
          <p>To complete your registration and start using Oravo, please verify your email address by clicking the button below:</p>
          <center>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </center>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}" class="link">${verificationUrl}</a></p>
          <div class="footer">
            <p>If you didn't create an account with Oravo, you can safely ignore this email.</p>
            <p>This verification link will expire in 24 hours.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to Oravo, ${username}!

Thank you for signing up! We're excited to have you on board.

To complete your registration and start using Oravo, please verify your email address by visiting:

${verificationUrl}

If you didn't create an account with Oravo, you can safely ignore this email.

This verification link will expire in 24 hours.

---
Oravo Analytics
  `;

  return { html, text };
}

export function generateWelcomeEmail(username: string) {
  const dashboardUrl = `${process.env.APP_URL || 'http://localhost:3000'}/dashboard`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #000000 0%, #2a2a2a 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          h1 {
            color: #000000;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .button {
            display: inline-block;
            background: #000000;
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .feature {
            margin: 15px 0;
            padding-left: 25px;
            position: relative;
          }
          .feature:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #000000;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Oravo</div>
          <h1>Email Verified Successfully! ✅</h1>
          <p>Hi ${username},</p>
          <p>Your email has been verified! You now have full access to all Oravo features:</p>
          <div class="feature">Track unlimited websites</div>
          <div class="feature">Real-time analytics</div>
          <div class="feature">Custom reports and insights</div>
          <div class="feature">Team collaboration</div>
          <div class="feature">Privacy-focused tracking</div>
          <center>
            <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
          </center>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy analyzing!</p>
        </div>
      </body>
    </html>
  `;

  const text = `
Email Verified Successfully!

Hi ${username},

Your email has been verified! You now have full access to all Oravo features:

✓ Track unlimited websites
✓ Real-time analytics
✓ Custom reports and insights
✓ Team collaboration
✓ Privacy-focused tracking

Visit your dashboard: ${dashboardUrl}

If you have any questions, feel free to reach out to our support team.

Happy analyzing!

---
Oravo Analytics
  `;

  return { html, text };
}
