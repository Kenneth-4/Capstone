# Fix Auto-Login Issue When Adding Members

## Problem
When adding a new member, Supabase's `signUp` function automatically logs in the new user, which logs out the admin.

## Solution
Configure Supabase to **require email confirmation** for new signups. This prevents auto-login.

## Steps to Fix

### 1. Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **Authentication** → **Providers** → **Email**

### 2. Enable Email Confirmation
1. Find the **"Confirm email"** setting
2. **Enable** the toggle for "Confirm email"
3. This ensures new users must confirm their email before they can log in

### 3. Disable Auto-Confirm (if enabled)
1. In the same Email provider settings
2. Make sure **"Enable email confirmations"** is **ON**
3. This prevents users from being auto-confirmed

### 4. Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize the "Confirm signup" email template
3. You can customize the message sent to new members

## Alternative: Disable Email Confirmations for Admin-Created Users

If you want admin-created users to be auto-confirmed but not auto-logged-in, you would need to:

1. Create a Supabase Edge Function (server-side)
2. Use the service role key in the Edge Function
3. Call the Edge Function from your frontend

This is more complex but provides better security and control.

## Quick Test

After enabling email confirmation:
1. Try adding a new member
2. You should remain logged in as admin
3. The new member will receive a confirmation email
4. They must click the link in the email before they can log in

## Note

With email confirmation enabled:
- New members cannot log in until they confirm their email
- You (admin) will stay logged in when creating new members
- The generated password is still valid once they confirm their email
