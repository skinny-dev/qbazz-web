# Runflare Deployment Guide - qbazz-web

## Overview

This React application is configured for deployment on Runflare's ReactJS/Static Site service.

## Prerequisites

- GitHub repository created for qbazz-web
- Runflare account with access to ReactJS service
- Backend API deployed at https://qbazz.runflare.run

## Runflare Configuration

### Service Type

**ReactJS** or **Static Site**

### Build Settings

```
Build Command: npm run build
Node Version: 20.x
Output Directory: dist
Install Command: npm ci
```

### Environment Variables

Add the following environment variable in Runflare service settings:

```
VITE_API_BASE=https://qbazz.runflare.run
```

Optional (if using Gemini AI features):

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Port Configuration

- **Target Port**: 80 (default for static sites)
- **External Port**: 80 or 443 (HTTPS)

### Domain Configuration

Options:

- Default: `qbazz-web.runflare.run` (or similar)
- Custom: `qbazz.com` or `www.qbazz.com`

If using custom domain:

1. Add CNAME record pointing to Runflare
2. Configure domain in Runflare service settings
3. SSL certificate will be provisioned automatically

## Project Structure

```
qbazz-web/
├── index.html          # Entry HTML
├── index.tsx           # React entry point
├── App.tsx             # Main app component
├── vite.config.ts      # Vite configuration
├── package.json        # Dependencies and scripts
├── .env.production     # Production environment vars
├── services/
│   └── api.ts          # API client (uses VITE_API_BASE)
├── components/         # React components
├── pages/              # Page components
├── hooks/              # Custom React hooks
└── public/             # Static assets
```

## Build Output

- Vite builds to `dist/` directory
- Static HTML, CSS, and JS files
- Optimized and minified for production
- Assets include hash for cache busting

## API Integration

The frontend communicates with the backend API via:

- Base URL: `VITE_API_BASE` environment variable
- Default fallback: `http://localhost:3000` (for local development)
- API client: `services/api.ts`

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run dev server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Steps

### 1. Push Code to GitHub

```bash
cd qbazz-web
git init
git add .
git commit -m "Initial commit - qbazz-web"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/qbazz-web.git
git push -u origin main
```

### 2. Create Runflare Service

1. Log in to Runflare dashboard
2. Click "New Service" or "+"
3. Select service type: **ReactJS** or **Static Site**
4. Connect to GitHub repository: `YOUR_USERNAME/qbazz-web`
5. Select branch: `main`

### 3. Configure Build Settings

```
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
Node Version: 20.x
```

### 4. Set Environment Variables

Add in Runflare service settings:

```
VITE_API_BASE=https://qbazz.runflare.run
```

### 5. Deploy

- Runflare will automatically build and deploy
- Monitor build logs for any errors
- Once deployed, access at provided URL

### 6. Verify Deployment

Test the following:

- [ ] Homepage loads correctly
- [ ] API connection works (products fetch)
- [ ] Images display properly
- [ ] Navigation functions
- [ ] Search and filters work
- [ ] Store pages load
- [ ] Product pages display

## Troubleshooting

### Build Fails

- Check Node version compatibility (use 20.x)
- Verify all dependencies in package.json
- Review build logs in Runflare dashboard
- Test build locally: `npm run build`

### API Connection Issues

- Verify VITE_API_BASE is set correctly
- Check backend API is running: https://qbazz.runflare.run/health
- Check browser console for CORS errors
- Verify backend allows frontend domain in CORS settings

### Assets Not Loading

- Check output directory is set to `dist`
- Verify public assets are in `public/` folder
- Check vite.config.ts base path configuration
- Review browser network tab for 404s

### Blank Page After Deployment

- Check browser console for JavaScript errors
- Verify index.html is in dist/ folder
- Check routing configuration (HashRouter vs BrowserRouter)
- Ensure all imports are correct and files exist

## Continuous Deployment

Runflare automatically redeploys when:

- New commits pushed to `main` branch
- Manual deploy triggered in dashboard
- Environment variables changed (may require rebuild)

## Performance Optimization

Already configured:

- Vite production build optimization
- Code splitting and lazy loading
- Asset minification and compression
- Cache busting with hashed filenames

## Monitoring

Monitor in Runflare dashboard:

- Build status and logs
- Deployment history
- Service health
- Traffic and bandwidth usage

## Custom Domain Setup

1. Go to Runflare service settings
2. Add custom domain: `qbazz.com`
3. Update DNS records at your domain provider:
   ```
   Type: CNAME
   Name: @ or www
   Value: [provided by Runflare]
   ```
4. Wait for DNS propagation (5-30 minutes)
5. SSL certificate auto-provisioned by Runflare

## Security Notes

- HTTPS enforced automatically by Runflare
- Environment variables encrypted at rest
- API credentials never exposed to client
- VITE_API_BASE is public (embedded in build)
- Keep GEMINI_API_KEY secure if used

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 6.2.0
- **TypeScript**: 5.8.2
- **UI**: Custom components
- **Hosting**: Runflare Static Site/ReactJS service
- **Backend**: qbazz-core API at https://qbazz.runflare.run

## Support

- Backend API: https://qbazz.runflare.run
- Backend Health: https://qbazz.runflare.run/health
- Runflare Docs: https://docs.runflare.run
- GitHub Issues: https://github.com/YOUR_USERNAME/qbazz-web/issues
