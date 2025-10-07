# Email/OTP Debug Guide

## Problem
Forgot Password is stuck on "Loading..." and not sending OTP emails.

## Root Cause Analysis

The forgot password flow works like this:
1. ✅ Frontend sends request to `/auth/forgot-password`
2. ✅ Backend checks if user exists
3. ✅ Backend generates OTP
4. ❌ **Email sending fails** (likely email configuration issue)
5. ❌ Frontend stays on "Loading..." because email service fails

## Debugging Steps

### 1. Check Backend Logs
Look at your Render backend logs for email errors:
```
Email sending failed: [error details]
```

### 2. Verify Email Configuration
Your backend needs these environment variables set correctly:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=202301040092@mitaoe.ac.in
EMAIL_PASS=wfkhgugxqojxbgur
EMAIL_FROM=202301040092@mitaoe.ac.in
```

### 3. Common Email Issues

#### Issue 1: Gmail App Password
**Problem**: Gmail requires "App Passwords" for SMTP
**Solution**: 
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password instead of regular password

#### Issue 2: Gmail Security
**Problem**: Gmail blocks "less secure apps"
**Solution**: 
1. Enable "Less secure app access" (not recommended)
2. **Better**: Use App Passwords (recommended)

#### Issue 3: Email Service Provider
**Problem**: Gmail SMTP might be blocked
**Solution**: Try alternative email services:
- **SendGrid** (recommended for production)
- **Mailgun**
- **Amazon SES**

## Quick Fixes

### Fix 1: Update Email Configuration
In your Render backend environment variables, ensure:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-gmail@gmail.com
```

### Fix 2: Test Email Service
Add this test endpoint to verify email configuration:

```typescript
// Add to authController.ts
static async testEmail(req: Request, res: Response): Promise<void> {
  try {
    await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1>',
      text: 'Test Email'
    });
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

### Fix 3: Use Console Logging
Update the email service to log errors:

```typescript
// In email.ts
async sendEmail(options: IEmailOptions): Promise<void> {
  try {
    console.log('Attempting to send email to:', options.to);
    console.log('Email config:', {
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      user: config.EMAIL_USER
    });
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
```

## Production Solutions

### Option 1: Use SendGrid (Recommended)
1. Sign up for SendGrid
2. Get API key
3. Update email configuration:

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourapp.com
```

### Option 2: Use Mailgun
1. Sign up for Mailgun
2. Get SMTP credentials
3. Update email configuration:

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-smtp-user
EMAIL_PASS=your-mailgun-smtp-password
EMAIL_FROM=noreply@yourdomain.com
```

## Testing Steps

### 1. Test Email Configuration
```bash
curl -X POST https://your-backend-url.onrender.com/api/v1/auth/test-email
```

### 2. Test Forgot Password
```bash
curl -X POST https://your-backend-url.onrender.com/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 3. Check Backend Logs
Look for:
- Email configuration errors
- SMTP connection errors
- Authentication errors

## Expected Results

After fixing email configuration:
1. ✅ Forgot password request completes
2. ✅ OTP email is sent successfully
3. ✅ Frontend shows success message
4. ✅ User receives OTP in email

## Next Steps

1. **Check Render logs** for email errors
2. **Update email configuration** with correct credentials
3. **Test email sending** with a simple test
4. **Redeploy backend** with fixed configuration
5. **Test forgot password** from frontend

The main issue is likely Gmail SMTP configuration - make sure you're using an App Password, not your regular Gmail password!

