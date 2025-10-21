# Google OAuth Setup Instructions

To enable Google OAuth authentication, you need to set up a Google Cloud project and get OAuth credentials.

## Steps to Get Google OAuth Credentials:

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project (or select existing)
- Click on the project dropdown at the top
- Click "New Project"
- Enter project name: "Task Manager" (or any name)
- Click "Create"

### 3. Enable Google+ API
- In the left sidebar, go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click on it and press "Enable"

### 4. Configure OAuth Consent Screen
- Go to "APIs & Services" → "OAuth consent screen"
- Select "External" user type
- Click "Create"
- Fill in required fields:
  - App name: "Task Manager"
  - User support email: (your email)
  - Developer contact: (your email)
- Click "Save and Continue"
- On Scopes page, click "Save and Continue"
- On Test users page, add your Gmail address, click "Save and Continue"

### 5. Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- Select "Web application"
- Enter name: "Task Manager Web Client"
- Under "Authorized JavaScript origins", add:
  ```
  http://localhost:5173
  http://localhost:3000
  ```
- Under "Authorized redirect URIs", add:
  ```
  http://localhost:3000/api/auth/google/callback
  ```
- Click "Create"

### 6. Copy Your Credentials
- You'll see a popup with your Client ID and Client Secret
- Copy these values

### 7. Update Your .env File
Open `server/.env` and update these values:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 8. Run the Database Migration
Execute the SQL migration to add OAuth support:

```bash
# Connect to MySQL
mysql -u taskuser -p taskmanager < server/src/sql/add_oauth.sql
```

Or run it manually in your MySQL client.

### 9. Restart Your Server
```bash
cd server
npm run dev
```

## Testing OAuth

1. Go to http://localhost:5173/login
2. Click "Continue with Google" button
3. You'll be redirected to Google's login page
4. Sign in with your Google account
5. Grant permissions
6. You'll be redirected back and logged in automatically!

## How It Works

1. User clicks "Continue with Google"
2. User is redirected to Google OAuth consent screen
3. User approves and Google redirects to `/api/auth/google/callback`
4. Backend receives user info from Google
5. Backend creates/updates user in database
6. Backend generates JWT token
7. Backend redirects to `/auth/callback?token=<jwt>`
8. Frontend stores token and fetches user data
9. User is logged in!

## Features

✅ Users can sign up/login with Google account
✅ No password needed for Google OAuth users
✅ Existing email accounts are linked automatically
✅ Same JWT authentication after OAuth
✅ Email/password login still works
✅ OAuth users have NULL password_hash in database

## Security Notes

- Never commit `.env` file with real credentials
- Use HTTPS in production
- Verify email from OAuth provider
- Implement rate limiting
- Add CSRF protection for production

## Production Deployment

For production, you'll need to:
1. Update Authorized origins and redirect URIs in Google Console
2. Change `CLIENT_ORIGIN` in `.env` to your production URL
3. Use production domain in callback URL
4. Verify your domain with Google
5. Submit app for OAuth verification (if needed)
