# Render Deployment Guide

## Backend Deployment

### 1. Prepare for Deployment
- Ensure all dependencies are in `package.json`
- Backend is configured to run on port 10000 (Render's default)
- CORS is configured for production domains

### 2. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `study-pulse-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: `Free`
   - **Region**: Choose nearest region

### 3. Environment Variables
Set these in Render Dashboard:
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-secure-session-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Database Setup
- The app uses JSON file storage for simplicity
- For production, consider migrating to PostgreSQL
- Current data location: `src/data/users.json`

### 5. Email Service
- Uses Gmail SMTP with App Password
- Ensure Gmail App Password is configured
- Update email credentials in environment variables

## Frontend Deployment (Vercel)

### 1. Update Environment Variables
In Vercel Dashboard, add:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

### 2. Automatic Configuration
The frontend automatically detects environment:
- **Development**: Uses `/api` (proxied to localhost:5000)
- **Production**: Uses Render backend URL

## Testing the Deployment

### 1. Backend Health Check
```bash
curl https://your-app-name.onrender.com/api/health
```

### 2. Registration Test
Test registration through your Vercel frontend:
1. Visit `https://study-pulse-ten.vercel.app/register`
2. Fill out registration form
3. Should successfully create user and send welcome email

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (local development)
- `http://localhost:5173` (Vite dev server)
- `https://study-pulse-ten.vercel.app` (production frontend)
- `https://study-pulse-backend.onrender.com` (production backend)

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure frontend URL is in CORS origins
2. **Email Failures**: Check Gmail App Password configuration
3. **Database Issues**: Ensure `src/data/` directory is writable
4. **Port Issues**: Render uses port 10000 by default

### Logs:
- Check Render Dashboard logs for errors
- Monitor email sending logs
- Check user registration attempts

## Next Steps

1. Deploy backend to Render using this guide
2. Update frontend with correct Render URL
3. Test full registration flow
4. Monitor for any issues in production
