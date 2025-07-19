# Deploying SecretNotFound to Render

This guide will help you deploy your Next.js Firebase Studio app to Render.

## Prerequisites

1. A GitHub repository with your code
2. A Render account (free tier available)
3. Google AI API key for GenKit
4. Firebase project credentials (if using Firebase services)

## Deployment Steps

### Method 1: Using Render Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin master
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `NINJAHATTORI004/secretnotfound`

3. **Configure the service**
   - **Name**: `secretnotfound` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or upgrade as needed)

4. **Set Environment Variables**
   In the Render dashboard, add these environment variables:
   ```
   NODE_ENV=production
   GOOGLE_AI_API_KEY=your_actual_google_ai_api_key
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
   FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - You'll get a URL like: `https://secretnotfound.onrender.com`

### Method 2: Using Blueprint (render.yaml)

1. **Use the included render.yaml**
   - The `render.yaml` file is already configured
   - Update the environment variables in the file with your actual values

2. **Deploy via Blueprint**
   - In Render dashboard, click "New" → "Blueprint"
   - Connect your repository
   - Render will use the `render.yaml` configuration

## Environment Variables You Need

### Required for GenKit AI:
- `GOOGLE_AI_API_KEY`: Get this from Google AI Studio

### Required for Firebase (if using):
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_API_KEY`: Firebase web API key
- `FIREBASE_AUTH_DOMAIN`: Usually `{project-id}.firebaseapp.com`
- `FIREBASE_DATABASE_URL`: Your Realtime Database URL
- `FIREBASE_STORAGE_BUCKET`: Usually `{project-id}.appspot.com`
- `FIREBASE_MESSAGING_SENDER_ID`: From Firebase project settings
- `FIREBASE_APP_ID`: From Firebase project settings

## Getting Your API Keys

### Google AI API Key:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key and add it to your environment variables

### Firebase Credentials:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → General
4. Scroll down to "Your apps" and find your web app
5. Copy the configuration values

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check your dependencies and ensure all required environment variables are set
2. **App Crashes**: Check the logs in Render dashboard for error details
3. **API Errors**: Verify your API keys are correct and have proper permissions

### Useful Commands:
```bash
# Test build locally
npm run build

# Test production locally
npm run build && npm start

# Check for TypeScript errors
npm run typecheck

# Check for linting errors
npm run lint
```

## Notes

- Render free tier has some limitations (sleeps after 15 minutes of inactivity)
- Your app will be available at: `https://your-app-name.onrender.com`
- SSL is automatically provided by Render
- Auto-deploys on every push to your main branch (if configured)

## Scaling

To handle more traffic, you can:
1. Upgrade to a paid Render plan
2. Increase the `maxInstances` in `apphosting.yaml` (if using Firebase App Hosting features)
3. Optimize your Next.js app for better performance
