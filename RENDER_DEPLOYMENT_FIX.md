# Render Deployment Memory Fix

## Problem
Your backend is running out of memory on Render with the error:
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

## Root Cause
1. **Wrong Start Command**: Render is running `npm run dev` instead of production start
2. **No Memory Limits**: Node.js process using too much memory
3. **Development Mode**: Using nodemon which consumes more memory

## Solutions Implemented

### 1. Updated Backend Package.json
- Added memory limit: `--max-old-space-size=512`
- Created production start script: `start:prod`
- Optimized for Render's free tier memory limits

### 2. Added Memory Optimization
- Added garbage collection optimization for production
- Reduced memory footprint

## Render Configuration Required

### Backend Service Settings

1. **Build Command**: `npm install; npm run build`
2. **Start Command**: `npm run start:prod` (NOT `npm run dev`)
3. **Environment Variables**:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://edumentor-crwa.onrender.com
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   OTP_SECRET=your_otp_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

### Frontend Service Settings

1. **Build Command**: `npm install; npm run build`
2. **Start Command**: `npm run preview` (or serve the dist folder)
3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-service.onrender.com/api/v1
   ```

## Step-by-Step Fix

### 1. Update Backend Service in Render

1. Go to your backend service dashboard
2. Go to **Settings** tab
3. Update **Start Command** to: `npm run start:prod`
4. Add environment variables (see list above)
5. **Redeploy** the service

### 2. Update Frontend Service in Render

1. Go to your frontend service dashboard  
2. Go to **Settings** tab
3. Add environment variable: `VITE_API_URL=https://your-backend-service.onrender.com/api/v1`
4. **Redeploy** the service

### 3. Verify Backend is Running

Check your backend health endpoint:
```
https://your-backend-service.onrender.com/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## Memory Optimization Features

### 1. Node.js Memory Limit
- Set to 512MB (`--max-old-space-size=512`)
- Suitable for Render's free tier

### 2. Garbage Collection
- Automatic GC every 30 seconds in production
- Reduces memory buildup

### 3. Production Optimizations
- Uses compiled JavaScript instead of TypeScript
- No development dependencies in production
- Optimized for minimal memory usage

## Troubleshooting

### If Still Getting Memory Errors

1. **Check Start Command**: Must be `npm run start:prod`
2. **Verify Environment**: `NODE_ENV=production`
3. **Check Logs**: Look for memory usage patterns
4. **Upgrade Plan**: Consider Render's paid plans for more memory

### Common Issues

**Issue**: "Cannot find module" errors
**Solution**: Ensure build completed successfully before start

**Issue**: CORS errors
**Solution**: Set `CORS_ORIGIN` to your frontend URL

**Issue**: Database connection errors  
**Solution**: Verify `MONGODB_URI` is correct

## Expected Results

After applying these fixes:

1. ✅ Backend starts without memory errors
2. ✅ Health endpoint responds correctly
3. ✅ Frontend can connect to backend API
4. ✅ Authentication works properly
5. ✅ No more "heap out of memory" errors

## Next Steps

1. Update both services with correct start commands
2. Add all required environment variables
3. Redeploy both services
4. Test the authentication flow
5. Monitor memory usage in Render dashboard

The memory issue should be completely resolved with these changes.
