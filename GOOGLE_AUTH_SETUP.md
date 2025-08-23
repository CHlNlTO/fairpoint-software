# Google Auth Setup Guide

This guide will help you set up Google Social Authentication for your Supabase project.

## Prerequisites

1. A Google Cloud project
2. A Supabase project

## Step 1: Google Cloud Console Configuration

### 1.1 Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application** as the application type
6. Add your site URL to **Authorized JavaScript origins**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
7. Add your site URL to **Authorized redirect URLs**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
8. Click **Create**
9. Copy the **Client ID** (you'll need this for the next step)

### 1.2 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Configure the consent screen with your app information
3. Add your app's privacy policy and terms of service URLs
4. Under **Authorized domains**, add your Supabase project domain: `<PROJECT_ID>.supabase.co`
5. Configure the following scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`

## Step 2: Supabase Dashboard Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and click **Edit**
5. Enable Google authentication
6. Add your Google Client ID to the **Client IDs** field
7. Leave the **OAuth client ID** and **OAuth client secret** fields blank (for pre-built approach)
8. Click **Save**

## Step 3: Environment Variables

Create a `.env.local` file in your project root and add:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Replace the placeholder values with your actual credentials.

**Note**: The `google-one-tap` library is already installed as a dependency.

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/auth/login` or `/auth/sign-up` to see Google buttons
3. Visit `/test-google` for a dedicated test page
4. Check the browser console for any errors
5. Google One Tap will automatically load on all pages

## Features Implemented

- **Google Sign-In Button**: Integrated into login and sign-up forms
- **Google One Tap**: Automatic sign-in prompts for better UX
- **Secure Nonce Validation**: Uses cryptographic nonces for security
- **Responsive Design**: Works on all device sizes
- **TypeScript Support**: Full type safety for Google Auth APIs

## Troubleshooting

### Common Issues

1. **"Invalid client" error**: Make sure your Google Client ID is correct and matches the one in Supabase
2. **Redirect URI mismatch**: Ensure your redirect URIs in Google Console match your app URLs
3. **CORS errors**: Check that your domain is properly configured in Google Console
4. **One Tap not showing**: Make sure you're not already signed in and the component is properly mounted
5. **FedCM NetworkError**: This has been resolved by disabling FedCM in development. The error was caused by Chrome's third-party cookie restrictions in localhost environments.

### Debug Mode

Enable console logging by checking the browser console for detailed error messages during the authentication flow.

## Security Notes

- The implementation uses nonce validation for enhanced security
- All authentication is handled server-side through Supabase
- No sensitive credentials are exposed to the client
- FedCM is disabled in development to avoid network errors, but can be enabled in production
- Uses the official `google-one-tap` library for type safety and reliability

## Next Steps

After successful setup, you can:

1. Customize the Google button appearance
2. Add additional OAuth providers (Facebook, GitHub, etc.)
3. Implement user profile management
4. Add role-based access control
5. Set up email templates for new users
