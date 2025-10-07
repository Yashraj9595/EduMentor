# Render Start Command Fix

## Problem
The build is successful, but Render is running the wrong start command:
```
> npm run dev
> nodemon src/server.ts
sh: 1: nodemon: not found
```

## Root Cause
Render is using the default start command `npm run dev` instead of the production command `npm run start:prod`. Nodemon is in devDependencies and not available in production.

## Solution

### Update Render Backend Service Settings

1. **Go to your Render backend service dashboard**
2. **Go to Settings tab**
3. **Update Start Command** from:
   ```
   npm run dev
   ```
   **To:**
   ```
   npm run start:prod
   ```

### Alternative: Update package.json

If you can't change the Render settings, update the default start script:

```json
{
  "scripts": {
    "start": "node --max-old-space-size=512 dist/server.js",
    "start:prod": "NODE_ENV=production node --max-old-space-size=512 dist/server.js"
  }
}
```

## Why This Fixes the Issue

### ✅ Production Command
- **`npm run start:prod`** uses compiled JavaScript files
- **No nodemon dependency** required
- **Memory optimized** with `--max-old-space-size=512`
- **Production environment** variables set

### ✅ Build vs Runtime
- **Build phase**: `npm install; npm run build` ✅ (Working)
- **Runtime phase**: `npm run start:prod` ✅ (Needs to be set)

## Expected Results After Fix

1. **Build Success** ✅ (Already working)
2. **Server Start** ✅ (Will work after command change)
3. **Health Endpoint** ✅ (Will respond correctly)
4. **Authentication** ✅ (Will work end-to-end)

## Verification Steps

After updating the start command:

1. **Check Render Logs** - Should show server starting successfully
2. **Test Health Endpoint** - `https://your-backend-url.onrender.com/health`
3. **Test Authentication** - Use your frontend or test-backend.html
4. **Check CORS** - No more CORS errors in browser console

## Complete Render Configuration

### Backend Service Settings:
- **Build Command**: `npm install; npm run build`
- **Start Command**: `npm run start:prod`
- **Environment Variables**: (See previous guides)

### Frontend Service Settings:
- **Build Command**: `npm install; npm run build`
- **Start Command**: `npm run preview` (or serve dist folder)
- **Environment Variables**: `VITE_API_URL=https://your-backend-url.onrender.com/api/v1`

## Next Steps

1. **Update Start Command** in Render dashboard
2. **Redeploy** the backend service
3. **Test Health Endpoint** - Should return server status
4. **Test Authentication** - Should work with frontend
5. **Update Frontend** - Set correct API URL

The authentication should now work completely end-to-end!
