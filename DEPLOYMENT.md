# Deployment Guide

This guide will help you set up the application for production deployment.

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Session Secret
SESSION_SECRET=<strong_random_string>

# Google OAuth Credentials
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=/api/users/auth/google/callback

# Frontend URL (production URL of your frontend)
FRONTEND_URL=https://your-production-domain.com

# Server URL (production URL of your backend)
SERVER_URL=https://api.your-production-domain.com

# JWT Secret
JWT_SECRET=<strong_random_string>

# Email Configuration
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>

# Other social media API keys
TWITTER_APP_KEY=<your_twitter_app_key>
TWITTER_APP_SECRET=<your_twitter_app_secret>
FACEBOOK_APP_ID=<your_facebook_app_id>
FACEBOOK_APP_SECRET=<your_facebook_app_secret>
```

### Frontend Environment Variables

Create a `.env.production` file in the frontend directory with the following variables:

```
# API Base URL (production URL of your backend)
VITE_API_BASE_URL=https://api.your-production-domain.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=<your_google_client_id>

# Other API Keys and URLs
VITE_UNSPLASH_API=https://api.unsplash.com/search/photos
VITE_UNSPLASH_CLIENT_ID=<your_unsplash_client_id>

VITE_PIXABAY_IMAGE_API=https://pixabay.com/api/
VITE_PIXABAY_VIDEO_API=https://pixabay.com/api/videos/
VITE_PIXABAY_API_KEY=<your_pixabay_api_key>

VITE_PEXELS_IMAGE_API=https://api.pexels.com/v1/search
VITE_PEXELS_VIDEO_API=https://api.pexels.com/videos/search
VITE_PEXELS_API_KEY=<your_pexels_api_key>

VITE_OPENVERSE_API=https://api.openverse.org/v1/images
VITE_GIPHY_API_KEY=<your_giphy_api_key>
VITE_OPENAI_KEY=<your_openai_key>
```

## Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Update the following settings:
   - **Authorized JavaScript origins**:
     - Add your production frontend URL (e.g., `https://your-production-domain.com`)
   - **Authorized redirect URIs**:
     - Add your production backend callback URL (e.g., `https://api.your-production-domain.com/api/users/auth/google/callback`)
5. Save the changes

## Backend Deployment Steps

1. Install dependencies:

   ```
   npm install
   ```

2. Build the project (if needed):

   ```
   npm run build
   ```

3. Start the server:
   - For production with PM2:
     ```
     pm2 start app.js --name backend
     ```
   - For regular production:
     ```
     NODE_ENV=production node app.js
     ```

## Frontend Deployment Steps

1. Install dependencies:

   ```
   npm install
   ```

2. Build the project:

   ```
   npm run build
   ```

3. Deploy the contents of the `dist` directory to your web server or hosting service.

## Security Considerations

1. Ensure all secrets and API keys are stored in environment variables and not committed to the codebase.
2. Use HTTPS for all production URLs.
3. Set appropriate CORS headers in production.
4. Implement rate limiting for API endpoints.
5. Set secure cookies for session management.
6. Regularly rotate API keys and secrets.

## Monitoring and Maintenance

1. Implement logging for both frontend and backend.
2. Set up monitoring for server health and performance.
3. Create a backup strategy for your database.
4. Plan for regular updates and maintenance.
