# 🔐 Google OAuth Setup Guide for Monastery360

This guide will help you set up Google OAuth authentication for your Monastery360 project using Supabase.

## 📋 Prerequisites

- Supabase project set up and running
- Google Cloud Console account
- Domain name (for production) or localhost (for development)

## 🚀 Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2 Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API

### 1.3 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Fill in the details:
   - **Name**: `Monastery360 OAuth`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://fqjgzgkeoebfdldhdxkb.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)

### 1.4 Get Your Credentials
1. After creating, you'll get:
   - **Client ID**: `your-google-client-id.googleusercontent.com`
   - **Client Secret**: `your-google-client-secret`

## 🔧 Step 2: Configure Supabase

### 2.1 Enable Google Provider
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and click **Enable**

### 2.2 Add Google Credentials
1. In the Google provider settings, add:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
2. **Site URL**: 
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

### 2.3 Configure Additional Settings
1. **Enable email confirmations**: Optional (recommended for production)
2. **Enable phone confirmations**: Optional
3. **Enable email change confirmations**: Optional

## 🧪 Step 3: Test the Integration

### 3.1 Start Your Development Server
```bash
npm run dev
```

### 3.2 Test Google OAuth
1. Visit `http://localhost:3000/login`
2. Click **Continue with Google**
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app

### 3.3 Verify User Creation
1. Check your Supabase dashboard → **Authentication** → **Users**
2. You should see the new user created
3. Check **Database** → **users** table for the user profile

## 🔒 Step 4: Security Configuration

### 4.1 Update Environment Variables
Add to your `.env.local`:
```env
# Google OAuth (Optional - Supabase handles this)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
```

### 4.2 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - **App name**: `Monastery360`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

### 4.3 Test Users (Development)
1. Add test users in OAuth consent screen
2. This allows testing without publishing the app

## 🚀 Step 5: Production Deployment

### 5.1 Update Redirect URIs
1. In Google Cloud Console, add your production domain:
   - `https://your-domain.com/auth/callback`
2. In Supabase, update Site URL and Redirect URLs

### 5.2 Publish OAuth Consent Screen
1. Go to **OAuth consent screen**
2. Click **Publish App** when ready
3. This makes it available to all users

### 5.3 Domain Verification (Optional)
1. For custom domains, verify ownership in Google Search Console
2. This improves trust and reduces security warnings

## 🐛 Troubleshooting

### Common Issues:

**1. "redirect_uri_mismatch" Error**
- Check that redirect URIs match exactly in Google Console and Supabase
- Ensure no trailing slashes or extra characters

**2. "access_denied" Error**
- Check OAuth consent screen configuration
- Ensure test users are added (for development)
- Verify scopes are properly configured

**3. User Not Created in Database**
- Check Supabase triggers are working
- Verify RLS policies allow user creation
- Check browser console for errors

**4. Infinite Redirect Loop**
- Check callback URL configuration
- Ensure Supabase redirect URL is correct
- Verify environment variables

### Debug Steps:
1. Check browser network tab for failed requests
2. Check Supabase logs in dashboard
3. Verify Google OAuth configuration
4. Test with different browsers/incognito mode

## 📱 Mobile Considerations

### For Mobile Apps:
1. Add mobile redirect URIs:
   - `com.yourapp://auth/callback`
2. Configure deep linking
3. Test on actual devices

## 🔄 User Flow

1. **User clicks "Continue with Google"**
2. **Redirected to Google OAuth consent screen**
3. **User authorizes the app**
4. **Google redirects to Supabase callback**
5. **Supabase processes the OAuth response**
6. **User is redirected to your app**
7. **User profile is automatically created**
8. **User is logged in and redirected to home page**

## ✅ Verification Checklist

- [ ] Google OAuth credentials created
- [ ] Supabase Google provider enabled
- [ ] Redirect URIs configured correctly
- [ ] OAuth consent screen configured
- [ ] Test users added (development)
- [ ] User creation working
- [ ] Login/logout flow working
- [ ] Production URLs configured (when ready)

## 🎉 Success!

Once configured, users can:
- Sign up with Google (creates new account)
- Sign in with Google (logs into existing account)
- Have their profile automatically created
- Access all Monastery360 features

Your Google OAuth integration is now complete! 🚀

