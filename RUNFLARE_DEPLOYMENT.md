# Runflare Deployment - Quick Reference

## ✅ qbazz-core (Backend API)

- **Status**: ✅ DEPLOYED & RUNNING
- **URL**: https://qbazz.runflare.run
- **Health Check**: https://qbazz.runflare.run/health
- **GitHub**: https://github.com/skinny-dev/qbazz-core
- **Port Config**: Target Port 3000, External Port 80
- **Database**: PostgreSQL (qbazz-db-hit-service:5432)
- **Latest Commit**: 444cb3c - "Add frontend domains to CORS allowed origins"

## 🚀 qbazz-web (Frontend)

- **Status**: ⏳ READY TO DEPLOY
- **GitHub**: https://github.com/skinny-dev/qbazz-web
- **Latest Commit**: e9d91fe - "Initial commit - qbazz-web frontend"
- **API Connection**: Configured to https://qbazz.runflare.run

### Runflare Service Configuration for qbazz-web

**Service Type**: ReactJS or Static Site

**GitHub Repository**:

```
Repository: skinny-dev/qbazz-web
Branch: main
```

**Build Configuration**:

```
Build Command: npm run build:ci   # runs runtime-config injection then builds
Output Directory: dist
Install Command: npm ci
Node Version: 20.x
```

**Environment Variables** (Add in Runflare):

```
API_BASE=https://api.qbazz.com
```

Recommended: create a lightweight `public/runtime-config.js` during your deploy with the following content to set the runtime global used by the app:

```html
<script>
   window.__QBAZZ_API_BASE__ = "https://api.qbazz.com";
</script>
```
This lets the static site pick up the correct API base at runtime without needing a rebuild.

Optional (if using Gemini AI):

```
GEMINI_API_KEY=your_gemini_api_key
```

**Port Configuration**:

- Target Port: 80 (default for static sites)
- External Port: 80/443

**Domain Options**:

- Default: qbazz-web.runflare.run (or similar)
- Custom: qbazz.com or www.qbazz.com

### Deployment Steps

1. **Go to Runflare Dashboard**

   - Click "New Service" or "+"

2. **Select Service Type**

   - Choose "ReactJS" or "Static Site"

3. **Connect GitHub Repository**

   - Repository: `skinny-dev/qbazz-web`
   - Branch: `main`

4. **Configure Build Settings**

   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm ci
   Node Version: 20.x
   ```

5. **Set Environment Variables**

   - Add: `API_BASE=https://api.qbazz.com` (or ensure `public/runtime-config.js` injects `window.__QBAZZ_API_BASE__`)

6. **Deploy**

   - Click "Deploy" or "Create Service"
   - Monitor build logs

7. **Verify Deployment**
   - Visit the provided URL
   - Test product loading
   - Check API connection
   - Verify all pages work

### API Integration Status

✅ **API Endpoints Used by Frontend**:

- `GET /api/products` - List products
- `GET /api/products/search` - Search products
- `GET /api/stores` - List stores
- `GET /api/categories/root` - Root categories

✅ **CORS Configuration**:
Backend allows:

- https://qbazz.com
- https://www.qbazz.com
- https://qbazz.runflare.run (backend)
- https://qbazz-web.runflare.run (frontend)
- http://localhost:5173 (local dev)

✅ **Frontend Configuration**:

- API base URL: `API_BASE` environment variable (preferred) or runtime global `window.__QBAZZ_API_BASE__`
- Default fallback: `http://localhost:3000` (for local dev)
- API client: `services/api.ts`

### Post-Deployment Verification

Test these features:

- [ ] Homepage loads
- [ ] Products fetch from API
- [ ] Store listings display
- [ ] Search functionality works
- [ ] Product details pages
- [ ] Store profile pages
- [ ] Images load correctly
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] API connection in browser console (no CORS errors)

### Troubleshooting

**Build Fails**:

- Check build logs in Runflare
- Verify Node version is 20.x
- Test locally: `npm run build`

- **API Connection Issues**:

- Verify `API_BASE` or runtime `window.__QBAZZ_API_BASE__` is set
- Check backend health: https://qbazz.runflare.run/health
- Check browser console for CORS errors
- Verify backend CORS includes frontend domain

**Blank Page**:

- Check browser console for errors
- Verify `dist` folder was created during build
- Check routing configuration

### Continuous Deployment

Auto-deploys on:

- Push to `main` branch
- Manual trigger in Runflare dashboard
- Environment variable changes

### Custom Domain Setup (Optional)

If using `qbazz.com`:

1. Add domain in Runflare service settings
2. Update DNS at domain provider:
   ```
   Type: CNAME
   Name: @ or www
   Value: [provided by Runflare]
   ```
3. Wait for DNS propagation (5-30 minutes)
4. SSL auto-provisioned

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                     User Browser                     │
└───────────────┬─────────────────────────────────────┘
                │
                │ HTTPS
                ▼
┌─────────────────────────────────────────────────────┐
│  qbazz-web (Frontend)                                │
│  https://qbazz-web.runflare.run                      │
│  - React 19 + TypeScript + Vite                      │
│  - Static site on Runflare                           │
└───────────────┬─────────────────────────────────────┘
                │
                │ API Calls
                ▼
┌─────────────────────────────────────────────────────┐
│  qbazz-core (Backend API)                            │
│  https://qbazz.runflare.run                          │
│  - Express.js + TypeScript + Prisma                  │
│  - Docker container on Runflare                      │
└───────────────┬─────────────────────────────────────┘
                │
                │ Database Queries
                ▼
┌─────────────────────────────────────────────────────┐
│  PostgreSQL Database                                 │
│  qbazz-db-hit-service:5432/qbazz-dbzku_db           │
└─────────────────────────────────────────────────────┘
```

## Next Steps

1. ✅ qbazz-core deployed and running
2. ✅ qbazz-web code pushed to GitHub
3. ⏳ Create qbazz-web service in Runflare
4. ⏳ Configure build and environment settings
5. ⏳ Deploy and verify
6. 📋 Optional: Configure custom domain
7. 📋 Optional: Set up monitoring/analytics

## Support

- **Backend API**: https://qbazz.runflare.run/health
- **GitHub Issues**:
  - Backend: https://github.com/skinny-dev/qbazz-core/issues
  - Frontend: https://github.com/skinny-dev/qbazz-web/issues
- **Runflare Docs**: https://docs.runflare.run
