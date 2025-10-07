# Test Project Flow

## Backend is now running with debugging

The backend should be running at `http://localhost:5000`

## Steps to Test:

### 1. Test Backend Health
Open a browser and go to: `http://localhost:5000/health`
You should see: `{"success":true,"message":"Server is running"...}`

### 2. Test Project Creation
1. Login to the frontend as a student
2. Go to "Create Project" page
3. Fill in the form and submit
4. Check the browser console for:
   - "Sending project data: ..."
   - "Project creation response: ..."
5. Check the backend terminal for:
   - "Creating project with data: ..."
   - "User ID: ..."

### 3. Test My Projects List
1. Go to "My Projects" page
2. Check the browser console for:
   - "Fetching projects..."
   - "Projects API response: ..."
   - "Projects data: ..."
3. Check the backend terminal for:
   - "Fetching projects for user: ..."
   - "Found projects: X"

### 4. Test Project Detail View
1. Click on "View Project" for any project
2. Check the browser console for any errors
3. Check the backend terminal for:
   - "Project studentId: ..."
   - "Request user ID: ..."
   - "User role: ..."
   - "Is owner: ..."

## Common Issues and Solutions:

### Issue: 403 Forbidden Error
This means the backend is blocking access to the project because:
- The project doesn't belong to the logged-in user
- There's a user ID mismatch
- The project doesn't exist

**Solution:**
1. Create a NEW project while logged in as the current user
2. Try to view that newly created project
3. This should work because it will belong to the current user

### Issue: Projects Not Displaying
This could be because:
- No projects exist in the database
- The user ID format is different from when projects were created
- The backend is not running

**Solution:**
1. Check if the backend terminal shows "Fetching projects for user: ..."
2. Check if it shows "Found projects: 0" or "Found projects: X"
3. If it shows 0, create a new project
4. If it shows a number but no projects display, check the browser console for errors

### Issue: Backend Not Running
**Solution:**
1. Open a terminal
2. Run: `cd backend`
3. Run: `npm run build`
4. Run: `npm start`
5. Check if you see "🚀 Server running on http://localhost:5000"

## Next Steps:

1. **Create a NEW project** while logged in as your current user
2. **View the NEW project** you just created
3. This should work because the project will belong to the current user
4. **Share the backend terminal logs** if you still have issues

## Backend Terminal Location:

The backend should be running in a terminal window. Look for a terminal/command prompt window that shows:
```
🚀 Server running on http://localhost:5000
📊 Environment: development
🔗 API Base URL: http://localhost:5000/api/v1
🌐 CORS Origin: http://localhost:3000
MongoDB Connected: ...
```

When you access pages or create projects, you should see debugging output in this terminal.




