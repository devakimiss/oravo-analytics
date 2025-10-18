# 🚀 SendGrid Setup for Vercel Deployment

## Quick Setup Guide

### Step 1: Verify Your Sender Email in SendGrid

**This is CRITICAL - SendGrid will not send emails from unverified addresses!**

1. Go to [SendGrid Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Click **"Verify a Single Sender"**
3. Enter your details:
   - **From Email**: `oravo@imoogleai.xyz`
   - **From Name**: `Oravo`
   - **Reply To**: `oravo@imoogleai.xyz`
   - Company Address (required by SendGrid)
4. Click **"Create"**
5. **Check your email** (`oravo@imoogleai.xyz`) for verification link
6. Click the verification link in the email
7. Wait for "Verified" status in SendGrid dashboard

⚠️ **Without this step, emails will fail with "Sender email not verified" error!**

---

### Step 2: Get Your SendGrid API Key

1. Go to [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
2. Click **"Create API Key"**
3. Name it: `Oravo Production`
4. Select **"Full Access"** (or at minimum "Mail Send" permissions)
5. Click **"Create & View"**
6. **Copy the API key** (you won't see it again!)
   - Example: `SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

---

### Step 3: Configure Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com)
2. Select your Oravo project
3. Go to **Settings** → **Environment Variables**
4. Add these 3 variables:

#### Variable 1: SENDGRID_API_KEY
```
Name: SENDGRID_API_KEY
Value: [YOUR SENDGRID API KEY - starts with SG.]
Environment: Production, Preview, Development (select all)
```

#### Variable 2: SENDGRID_FROM_EMAIL
```
Name: SENDGRID_FROM_EMAIL
Value: [YOUR VERIFIED EMAIL - e.g., oravo@imoogleai.xyz]
Environment: Production, Preview, Development (select all)
```

#### Variable 3: APP_URL
```
Name: APP_URL
Value: https://your-app-name.vercel.app
Environment: Production, Preview, Development (select all)
```

Replace `your-app-name.vercel.app` with your actual Vercel domain!

5. Click **"Save"** for each variable

---

### Step 4: Redeploy Your Application

After adding environment variables:

1. Go to **Deployments** tab in Vercel
2. Click **⋯** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete (2-3 minutes)

---

### Step 5: Test Email Verification

1. Go to your signup page
2. Create a test account with a real email
3. Check your email inbox for verification email
4. Click the verification link

---

## 🔍 Troubleshooting

### Error: "Sender email not verified"
- **Solution**: Complete Step 1 above. Check SendGrid sender auth status.

### Error: "Invalid API key"
- **Solution**: Regenerate API key in SendGrid, update in Vercel, redeploy.

### Emails not arriving
- **Solution**: 
  1. Check spam/junk folder
  2. Verify sender email is verified in SendGrid
  3. Check Vercel logs for errors
  4. Wait 5-10 minutes (email delays)

### Wrong verification link domain
- **Solution**: Check `APP_URL` in Vercel environment variables matches your domain.

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] SendGrid sender email verified (shows "Verified" in dashboard)
- [ ] API key created with Mail Send permissions
- [ ] All 3 environment variables added to Vercel
- [ ] Application redeployed after adding variables
- [ ] Test signup works and email arrives
- [ ] Verification link uses correct domain (APP_URL)

---

## 📊 SendGrid Free Tier Limits

- **100 emails per day** (free forever)
- Perfect for small to medium traffic
- Upgrade if you need more

---

## 🆘 Need Help?

Check Vercel deployment logs:
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Go to **"Functions"** tab
4. Look for `/api/users` logs

Check browser console:
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for error messages during signup

---

## 🎉 Success!

Once configured correctly, users will:
1. Sign up with email
2. Receive beautiful verification email
3. Click link to verify
4. Get welcomed to Oravo!

All automated! ✨
