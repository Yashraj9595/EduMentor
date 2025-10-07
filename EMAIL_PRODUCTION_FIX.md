# Email/OTP Production Fix Guide

## 🚨 Problem
OTP emails are not being sent after deploying the project to production (Render/Vercel).

## 🔍 Root Causes

1. **Gmail Authentication Issues**
   - Gmail requires App Passwords for SMTP
   - Regular Gmail passwords don't work with SMTP
   - 2-Factor Authentication must be enabled

2. **Environment Variables**
   - Email configuration not set correctly in production
   - Missing or incorrect environment variables

3. **Error Handling**
   - Email failures are being silently caught
   - No proper error logging for debugging

## 🛠️ Solutions

### Solution 1: Fix Gmail Authentication

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled

#### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "EduMentor Backend" as the name
4. Copy the generated 16-character password

#### Step 3: Update Environment Variables
In your production environment (Render/Vercel), set these variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=202301040092@mitaoe.ac.in
```

### Solution 2: Test Email Configuration

#### Step 1: Test Email Endpoint
Use the new test endpoint to verify email configuration:

```bash
curl -X POST https://your-backend-url.onrender.com/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@gmail.com"}'
```

#### Step 2: Check Backend Logs
Look for these log messages in your production logs:
- `📧 Attempting to send email to:`
- `📧 Email config:`
- `✅ Email sent successfully to`
- `❌ Email sending failed:`

### Solution 3: Alternative Email Services

If Gmail continues to have issues, use these alternatives:

#### Option A: SendGrid (Recommended)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourapp.com
```

#### Option B: Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-smtp-user
EMAIL_PASS=your-mailgun-smtp-password
EMAIL_FROM=noreply@yourdomain.com
```

#### Option C: Amazon SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASS=your-ses-smtp-password
EMAIL_FROM=noreply@yourdomain.com
```

## 🧪 Testing Steps

### 1. Test Email Configuration
```bash
# Test with your email
curl -X POST https://your-backend-url.onrender.com/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

### 2. Test OTP Flow
1. Go to your frontend
2. Try "Forgot Password" with a valid email
3. Check backend logs for email sending attempts
4. Check your email inbox (including spam folder)

### 3. Debug Common Issues

#### Issue: "Authentication failed"
**Solution**: Use App Password instead of regular password

#### Issue: "Connection timeout"
**Solution**: Check if port 587 is blocked, try port 465 with SSL

#### Issue: "Invalid credentials"
**Solution**: Verify EMAIL_USER and EMAIL_PASS are correct

#### Issue: "Rate limit exceeded"
**Solution**: Gmail has sending limits, consider using SendGrid

## 📋 Production Environment Variables Checklist

Ensure these are set in your production environment:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=your-app-password-here
EMAIL_FROM=202301040092@mitaoe.ac.in

# Other Required Variables
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
OTP_SECRET=your-otp-secret
```

## 🚀 Deployment Steps

### 1. Update Code
The code has been updated with better error logging and test endpoint.

### 2. Deploy to Production
```bash
git add .
git commit -m "Fix email configuration and add debugging"
git push origin main
```

### 3. Set Environment Variables
In your production platform (Render/Vercel):
- Set all email-related environment variables
- Use App Password for Gmail
- Test the configuration

### 4. Verify Deployment
1. Check backend logs for email configuration
2. Test the `/api/v1/auth/test-email` endpoint
3. Try the forgot password flow
4. Verify OTP emails are being sent

## 🔧 Troubleshooting

### Check Backend Logs
Look for these patterns in your production logs:

```
📧 Attempting to send email to: user@example.com
📧 Email config: { host: 'smtp.gmail.com', port: 587, ... }
✅ Email sent successfully to user@example.com
```

Or error messages:
```
❌ Email sending failed: Authentication failed
❌ Error details: Invalid login: 535-5.7.8 Username and Password not accepted
```

### Common Error Messages

1. **"Invalid login: 535-5.7.8"**
   - Use App Password instead of regular password
   - Enable 2-Factor Authentication

2. **"Connection timeout"**
   - Check if port 587 is accessible
   - Try port 465 with SSL

3. **"Rate limit exceeded"**
   - Gmail has daily sending limits
   - Consider using SendGrid for production

4. **"Authentication failed"**
   - Verify EMAIL_USER and EMAIL_PASS
   - Ensure App Password is correct

## 📞 Support

If issues persist:
1. Check production logs for detailed error messages
2. Test email configuration with the test endpoint
3. Consider switching to SendGrid or Mailgun
4. Verify all environment variables are set correctly

## ✅ Success Indicators

You'll know the fix is working when:
- Test email endpoint returns success
- OTP emails are received in inbox
- Backend logs show "Email sent successfully"
- Forgot password flow completes without errors
