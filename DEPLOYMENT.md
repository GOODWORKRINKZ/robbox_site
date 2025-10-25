# Deployment Guide

## GitHub Pages Deployment

This website is configured to be automatically deployed to GitHub Pages.

### Prerequisites

1. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

### Automatic Deployment

The website will be automatically deployed when:
- Changes are pushed to the `main` branch
- Workflow is manually triggered from the Actions tab

### Manual Deployment

1. Go to the Actions tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

### Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

The preview will be available at `http://localhost:4173`

## Alternative Deployment Options

### Vercel

1. Import your GitHub repository at https://vercel.com
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy

### Netlify

1. Import your GitHub repository at https://netlify.com
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Deploy

### Custom Server

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy the `dist` folder contents to your web server

3. Configure your web server to serve the static files

## Environment Variables

If you need to use environment variables:

1. Create a `.env` file in the root directory
2. Add variables prefixed with `VITE_`:
   ```
   VITE_API_URL=https://api.example.com
   ```
3. Access in code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL
   ```

## Custom Domain

### GitHub Pages

1. Add your domain to Settings → Pages → Custom domain
2. Create a `CNAME` file in the `public` directory with your domain
3. Configure DNS records with your domain provider

### Other Platforms

Follow the platform-specific instructions for custom domains.
