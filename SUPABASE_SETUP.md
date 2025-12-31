# Supabase Database Setup Guide

## Problem
User registration is successful but data is not being stored in the Supabase `user_profiles` table.

## Solution
I've already implemented the code to store user data in Supabase. Now you need to:

### 1. Set up Environment Variables
Create a `.env` file in your project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://krdocvyhqttfyhbhcice.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_okjtlco2JXLny4ytO7ey4Q_dE8-tR-W

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 2. Restart Backend Server
Stop and restart your backend server to load the new environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run server
```

### 3. Test the Supabase Connection
Visit this URL in your browser to test the connection:
```
http://localhost:3001/api/users/test-supabase
```

### 4. Test Registration
After the test passes, try registering a new user. The user data should now appear in both:
- Local JSON file (existing functionality)
- Supabase `user_profiles` table (new functionality)

## What I've Implemented

1. **Supabase Client** (`src/services/supabaseClient.js`)
2. **User Profile Service** (`src/services/userProfileService.js`)
3. **Enhanced Registration** - Now stores data in both local JSON and Supabase
4. **Test Route** - `/api/users/test-supabase` to verify connection

## Expected Behavior
When a user registers successfully:
- ✅ User data stored in local JSON file (existing)
- ✅ User profile created in Supabase `user_profiles` table (new)
- ✅ Welcome email sent
- ✅ User redirected to login page

## Troubleshooting
If the test fails:
1. Check that your `.env` file has the correct Supabase URL and key
2. Verify the `user_profiles` table exists in Supabase
3. Check the browser console for error messages
4. Check the backend server console for detailed error logs
