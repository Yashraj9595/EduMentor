# Authentication Debug Guide

## Current Issue
Your frontend is correctly connecting to the backend API (`https://edumentor-crwa.onrender.com/api/v1`), but no access tokens are being found. This indicates an authentication flow problem.

## Debugging Steps

### 1. Check Backend CORS Configuration

Your backend needs to allow your frontend domain. In your Render backend service, set these environment variables:

```env
CORS_ORIGIN=https://edumentor-crwa.onrender.com
NODE_ENV=production
```

### 2. Test Backend Health

First, verify your backend is running:
```
https://edumentor-crwa.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 3. Test Authentication Endpoints

Test if your auth endpoints are working:

**Login endpoint:**
```
POST https://edumentor-crwa.onrender.com/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 4. Check Browser Network Tab

1. Open browser dev tools
2. Go to Network tab
3. Try to login
4. Look for:
   - CORS errors (red requests)
   - 401/403 responses
   - Missing Authorization headers

### 5. Check Console for Errors

Look for these specific errors:
- `CORS policy` errors
- `Failed to fetch` errors
- `401 Unauthorized` responses
- `Network Error` messages

## Common Issues and Solutions

### Issue 1: CORS Error
**Error**: `Access to fetch at 'https://edumentor-crwa.onrender.com/api/v1/auth/login' from origin 'https://edumentor-crwa.onrender.com' has been blocked by CORS policy`

**Solution**: 
1. Set `CORS_ORIGIN=https://edumentor-crwa.onrender.com` in backend environment variables
2. Redeploy backend

### Issue 2: 401 Unauthorized
**Error**: `401 Unauthorized` responses

**Solution**:
1. Check if backend is running properly
2. Verify database connection
3. Check JWT_SECRET is set

### Issue 3: Network Error
**Error**: `Failed to fetch` or network errors

**Solution**:
1. Verify backend URL is correct
2. Check if backend service is running
3. Verify SSL certificates

### Issue 4: No Tokens Stored
**Error**: `Retrieved access token from localStorage: false`

**Solution**:
1. Check if login response includes tokens
2. Verify token storage in localStorage
3. Check for JavaScript errors preventing storage

## Step-by-Step Fix

### Step 1: Update Backend Environment Variables

In your Render backend service dashboard:

1. Go to **Environment** tab
2. Add these variables:
   ```
   CORS_ORIGIN=https://edumentor-crwa.onrender.com
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   OTP_SECRET=your_otp_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

### Step 2: Update Start Command

Make sure your backend start command is:
```
npm run start:prod
```

### Step 3: Redeploy Backend

1. Save environment variables
2. Click **Manual Deploy** or **Redeploy**
3. Wait for deployment to complete

### Step 4: Test Backend

1. Check health endpoint: `https://edumentor-crwa.onrender.com/health`
2. Test login endpoint with curl or Postman
3. Verify CORS headers in response

### Step 5: Test Frontend

1. Clear browser cache and localStorage
2. Try to login
3. Check browser console for errors
4. Check Network tab for API calls

## Expected Flow

When working correctly, you should see:

1. **Login Request**: POST to `/api/v1/auth/login`
2. **Response**: 200 with user data and tokens
3. **Token Storage**: Tokens stored in localStorage
4. **Auth Check**: `Retrieved access token from localStorage: true`
5. **User State**: User object stored in context

## Debugging Commands

### Test Backend Health
```bash
curl https://edumentor-crwa.onrender.com/health
```

### Test Login (replace with real credentials)
```bash
curl -X POST https://edumentor-crwa.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Check CORS Headers
```bash
curl -H "Origin: https://edumentor-crwa.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS \
  https://edumentor-crwa.onrender.com/api/v1/auth/login
```

## Next Steps

1. **Set CORS_ORIGIN** environment variable in backend
2. **Redeploy backend** with correct settings
3. **Test health endpoint** to verify backend is running
4. **Try login** and check browser console
5. **Share results** if issues persist

The main issue is likely CORS configuration - your backend needs to explicitly allow your frontend domain.
