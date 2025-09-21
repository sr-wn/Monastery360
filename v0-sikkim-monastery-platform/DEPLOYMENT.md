# Deployment Guide

This guide covers different deployment options for the Monastery360 platform.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/monastery360.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

### Environment Variables for Vercel
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build image
docker build -t monastery360 .

# Run container
docker run -p 3000:3000 monastery360
```

## ☁️ AWS Deployment

### Using AWS Amplify
1. Connect your GitHub repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
3. Set environment variables
4. Deploy

### Using AWS EC2
1. Launch EC2 instance (Ubuntu 20.04)
2. Install Node.js and PM2
3. Clone repository
4. Install dependencies and build
5. Use PM2 to run the application

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Required
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-app-domain.com

# Optional
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Backend Configuration
- Ensure Java 17+ is installed
- Configure database connection
- Set up proper security headers
- Configure CORS for your domain

## 📊 Performance Optimization

### Frontend Optimizations
- Enable Next.js image optimization
- Use CDN for static assets
- Implement proper caching headers
- Enable compression

### Backend Optimizations
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use proper indexing

## 🔒 Security Considerations

### Frontend Security
- Enable HTTPS
- Set security headers
- Validate all inputs
- Use Content Security Policy

### Backend Security
- Use environment variables for secrets
- Implement proper authentication
- Validate all API inputs
- Use HTTPS for all communications

## 📈 Monitoring and Analytics

### Recommended Tools
- **Vercel Analytics** (built-in)
- **Google Analytics** (optional)
- **Sentry** for error tracking
- **Uptime monitoring** (UptimeRobot, Pingdom)

### Health Checks
- Implement `/api/health` endpoint
- Monitor database connectivity
- Check external API dependencies

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Runtime Errors**
   - Verify environment variables
   - Check database connectivity
   - Review application logs

3. **Performance Issues**
   - Enable Next.js optimizations
   - Check image sizes and formats
   - Monitor bundle size

### Support
For deployment issues, please:
1. Check the logs in your deployment platform
2. Verify all environment variables are set
3. Ensure all dependencies are properly installed
4. Create an issue in the GitHub repository

## 📝 Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] All pages are accessible
- [ ] Images load correctly
- [ ] Interactive features work
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Analytics tracking working
- [ ] Error monitoring set up
- [ ] Backup strategy in place
