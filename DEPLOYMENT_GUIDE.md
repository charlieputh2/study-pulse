# 🚀 Study Pulse Deployment Guide

## 📦 Production Build Status

✅ **Frontend**: Built and ready in `dist/` folder  
✅ **Backend**: Packaged and ready in `deploy-backend/` folder

---

## 🌐 Frontend Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from dist folder
cd dist
vercel --prod
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
```bash
npm install -g gh-pages
gh-pages -d dist
```

---

## 🔧 Backend Deployment Options

### Option 1: Traditional VPS/Server
1. **Upload** the entire `deploy-backend/` folder to your server
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```
4. **Start the server**:
   ```bash
   npm start
   ```
5. **Test the API**:
   ```bash
   curl http://your-domain.com:5000/api/health
   ```

### Option 2: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Option 3: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Create app and deploy
heroku create your-app-name
git subtree push --prefix deploy-backend heroku main
```

---

## 🔧 Environment Configuration

### Required Environment Variables
```env
NODE_ENV=production
PORT=5000
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
SESSION_SECRET=your-secure-session-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
SECURE_COOKIES=true
CORS_ORIGIN=https://your-domain.com
```

---

## 🌐 Access Points

### Frontend
- **Local**: http://localhost:3001
- **Production**: https://your-domain.com

### Backend API
- **Local**: http://localhost:5000/api
- **Production**: https://your-domain.com:5000/api

### API Endpoints
- **Health Check**: `/api/health`
- **Users**: `/api/users/*`
- **Email**: `/api/email/*`

---

## 🔒 Security Considerations

1. **HTTPS**: Ensure SSL certificates are installed
2. **Environment Variables**: Never commit `.env` files
3. **CORS**: Update `CORS_ORIGIN` to your domain
4. **Session Secret**: Use a strong, unique secret
5. **Database**: Use production Supabase credentials

---

## 📊 Performance Monitoring

### Frontend
- Google PageSpeed Insights
- GTmetrix
- Web Vitals

### Backend
- API response times
- Error rates
- Server uptime

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Deploy Frontend
        run: |
          npm ci
          npm run build
          # Deploy to your hosting service
      - name: Deploy Backend
        run: |
          # Deploy backend to your server
```

---

## 🚨 Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in environment
2. **CORS errors**: Update CORS_ORIGIN
3. **Database connection**: Check Supabase credentials
4. **File uploads**: Ensure uploads directory permissions

### Health Check
```bash
# Test API health
curl https://your-domain.com:5000/api/health

# Expected response
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-01-16T10:12:33.404Z"
}
```

---

## ✅ Deployment Checklist

- [ ] Frontend built and tested
- [ ] Backend packaged and tested
- [ ] Environment variables configured
- [ ] Database connections verified
- [ ] SSL certificates installed
- [ ] CORS settings updated
- [ ] File upload permissions set
- [ ] Health check endpoint accessible
- [ ] Error monitoring configured
- [ ] Backup strategy implemented

---

## 🎉 Success!

Your Study Pulse application is now ready for production deployment with:
- ✨ Advanced carousels and animations
- 📱 Mobile-responsive design
- 🔗 Telegram integrations
- 🛡️ Secure backend API
- ⚡ Optimized performance

Deploy both frontend and backend to provide the complete user experience!
