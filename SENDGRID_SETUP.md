# SendGrid Email Setup Guide

This guide will help you set up SendGrid for sending verification emails in Oravo.

## Why SendGrid?

SendGrid is a reliable, cloud-based email service that's much easier to configure than traditional SMTP. Benefits include:

- ✅ Easy setup (just one API key)
- ✅ High deliverability rates
- ✅ Free tier (100 emails/day)
- ✅ No firewall/port issues
- ✅ Detailed analytics
- ✅ Professional service

## Quick Setup (5 minutes)

### 1. Create SendGrid Account

1. Go to [SendGrid Signup](https://signup.sendgrid.com/)
2. Create a free account
3. Verify your email address

### 2. Get Your API Key

1. Log in to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `Oravo Email Service`
5. Select **Full Access** (or **Restricted Access** with Mail Send permission)
6. Click **Create & View**
7. **Copy the API key** (you'll only see it once!)

### 3. Verify Sender Identity

**Important:** SendGrid requires you to verify your sender email address.

#### Option A: Single Sender Verification (Easiest for testing)

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - **From Name**: Oravo Analytics
   - **From Email**: noreply@yourdomain.com (or your email for testing)
   - **Reply To**: support@yourdomain.com
   - **Company**: Your Company Name
4. Click **Create**
5. Check your email and click the verification link

#### Option B: Domain Authentication (Better for production)

1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow the DNS setup instructions
4. Wait for verification (can take up to 48 hours)

### 4. Configure Oravo

Add these to your `.env` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# App URL (required for verification links)
APP_URL=https://your-domain.com
```

**Important:** 
- `SENDGRID_FROM_EMAIL` must match the email you verified in Step 3
- Use your actual domain for `APP_URL` in production

### 5. Test It!

1. Restart your Oravo server
2. Sign up with a new account
3. Check your email for the verification link
4. Check SendGrid dashboard for delivery stats

## Free Tier Limits

SendGrid free tier includes:
- **100 emails/day** (3,000/month)
- Perfect for small to medium sites
- All features included
- No credit card required

## Troubleshooting

### Emails Not Sending?

1. **Check API Key**: Make sure it's correct in `.env`
2. **Verify Sender**: Ensure your from email is verified
3. **Check Console**: Look for error messages
4. **Check SendGrid Activity**: Go to Activity Feed in dashboard

### "Sender not verified" Error?

- Complete Step 3 (Verify Sender Identity)
- Make sure `SENDGRID_FROM_EMAIL` matches your verified email

### Emails Going to Spam?

- Use domain authentication (Option B)
- Add SPF and DKIM records
- Use a custom domain (not Gmail/Yahoo)
- Warm up your domain gradually

## Console Fallback

If SendGrid is not configured, Oravo will:
- Show verification URLs in the console
- Allow you to copy/paste the link
- Perfect for local development

## Production Tips

1. **Use Domain Authentication**: Better deliverability
2. **Monitor Activity Feed**: Check email delivery status
3. **Set Up Alerts**: Get notified of issues
4. **Use Templates**: Create branded email templates
5. **Add Unsubscribe**: Required for marketing emails

## Cost

- **Free**: 100 emails/day forever
- **Essentials**: $19.95/month for 50,000 emails
- **Pro**: $89.95/month for 100,000 emails

For most small-medium sites, the free tier is plenty!

## Need Help?

- SendGrid Docs: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- Test your setup: https://app.sendgrid.com/guide/integrate

---

**Ready to send emails! 🚀**
