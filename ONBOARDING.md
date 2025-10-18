# Oravo Email Verification & Onboarding System

## Features

### 📧 Email Verification
- New users receive a verification email upon signup
- Email verification tokens expire after 24 hours
- Users can resend verification emails
- Beautiful HTML email templates with Oravo branding
- Fallback to console logging if SMTP is not configured

### 🎯 User Onboarding
- 3-step onboarding flow for new users
- Collect display name and company information
- Setup first website during onboarding
- Feature highlights and benefits
- Skippable onboarding flow
- Progress indicator

### 🔐 Security Features
- Unique email addresses required
- Email verification required for full access
- Secure verification tokens
- Token expiration handling

## Setup Instructions

### 1. Database Migration

Run the migration to add email fields to the User table:

```bash
# For PostgreSQL
psql -d oravo < db/postgresql/migrations/01_add_email_verification.sql

# Or using Prisma
pnpm prisma db push
```

### 2. Configure Email Service (Optional)

Add these environment variables to your `.env` file:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@oravo.com

# App URL
APP_URL=http://localhost:3000
```

#### Gmail Setup

If using Gmail:
1. Enable 2-factor authentication
2. Generate an "App Password" in your Google Account settings
3. Use the app password in `SMTP_PASSWORD`

#### Other Email Providers

**SendGrid:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**Mailgun:**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.com
SMTP_PASSWORD=your-mailgun-password
```

### 3. Install Dependencies

```bash
pnpm install
```

This will install the required `nodemailer` package.

## User Flow

### Signup Flow

1. **User Signs Up** (`/signup`)
   - Enters username, email, password
   - Email validation performed
   - Verification token generated

2. **Verification Email Sent**
   - Branded HTML email with verification link
   - Token expires in 24 hours
   - Link format: `/verify-email?token=xxxxx`

3. **Email Verification** (`/verify-email`)
   - Token validated
   - User status updated
   - Welcome email sent
   - Redirect to login

4. **User Logs In** (`/login`)
   - Email verification status checked
   - Redirect to onboarding if not completed

5. **Onboarding Flow** (`/onboarding`)
   - Step 1: Personal information
   - Step 2: Add first website
   - Step 3: Feature overview
   - Redirect to dashboard

## API Endpoints

### POST /api/users
Create a new user with email verification.

**Request:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secure123",
  "role": "user"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "john",
  "email": "john@example.com",
  "emailVerified": false,
  "onboardingCompleted": false,
  "role": "user"
}
```

### POST /api/auth/verify-email
Verify user email with token.

**Request:**
```json
{
  "token": "verification-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### POST /api/auth/resend-verification
Resend verification email.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

## Email Templates

### Verification Email
- Oravo branded header
- Welcome message
- Clear call-to-action button
- Plain text fallback
- Link expiration notice

### Welcome Email (After Verification)
- Success confirmation
- Feature list
- Dashboard link
- Support information

## Customization

### Email Templates

Edit the email templates in `src/lib/email.ts`:

```typescript
export function generateVerificationEmail(username: string, token: string) {
  // Customize HTML template
  const html = `...`;
  
  // Customize plain text version
  const text = `...`;
  
  return { html, text };
}
```

### Onboarding Steps

Modify the onboarding flow in `src/app/onboarding/OnboardingFlow.tsx`:

```typescript
// Add more steps
const [step, setStep] = useState(1);
const totalSteps = 4; // Increase if adding more steps

// Add custom fields
const [formData, setFormData] = useState({
  displayName: '',
  companyName: '',
  role: '',
  // Add your fields here
});
```

### Styling

Update styles in:
- `src/app/signup/SignupForm.module.css`
- `src/app/verify-email/VerifyEmailForm.module.css`
- `src/app/onboarding/OnboardingFlow.module.css`

## Testing

### Without SMTP Configuration

If SMTP is not configured, emails will be logged to the console:

```bash
Email not configured. Email would be sent to: user@example.com
Subject: Verify Your Oravo Email Address
Content: [verification link]
```

You can manually navigate to `/verify-email?token=xxxxx` for testing.

### With SMTP Configuration

1. Sign up with a real email address
2. Check inbox for verification email
3. Click verification link
4. Complete onboarding
5. Access dashboard

## Troubleshooting

### Emails Not Sending

1. Check SMTP credentials in `.env`
2. Verify SMTP port (usually 587 or 465)
3. Check spam/junk folder
4. Review console logs for errors
5. Test SMTP connection:

```bash
# Use nodemailer test
node -e "require('nodemailer').createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'user@gmail.com', pass: 'password' }
}).verify((err, success) => console.log(err || 'Connected'))"
```

### Verification Token Expired

- Tokens expire after 24 hours
- User can request new verification email
- Use resend verification endpoint

### Database Errors

If you get column errors:
```bash
# Regenerate Prisma client
pnpm prisma generate

# Push schema changes
pnpm prisma db push
```

## Security Best Practices

1. **Use HTTPS** in production (`APP_URL=https://your-domain.com`)
2. **Secure SMTP** credentials (use environment variables)
3. **Rate limit** signup and verification endpoints
4. **Token expiration** enforced (24 hours)
5. **Email uniqueness** validated
6. **Password strength** enforced on frontend

## Production Deployment

1. Set production `APP_URL`
2. Configure production SMTP service
3. Use secure SMTP connection (`SMTP_SECURE=true`)
4. Enable HTTPS
5. Run database migrations
6. Test complete signup flow

## Support

For issues or questions:
- Check this documentation
- Review console logs
- Verify environment variables
- Test SMTP connection
