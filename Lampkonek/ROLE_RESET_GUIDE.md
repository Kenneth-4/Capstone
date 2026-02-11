# How to Reset User Roles and Fix the Role Management System

## Problem
You had "legacy roles" (roles that exist in user profiles but not in the `roles` table) that couldn't be properly edited. The signup form also had hardcoded role values that didn't match the database.

## Solution Overview
We've implemented a two-part solution:
1. **SQL Migration**: Resets all user roles and populates the roles table
2. **Dynamic Signup Form**: Fetches roles from the database instead of using hardcoded values

---

## Step 1: Run the SQL Migration

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file: `migrations/reset_user_roles.sql`
5. Copy and paste the entire SQL script into the editor
6. Click **Run** to execute the migration

### Option B: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

### What the Migration Does:
✅ Resets all user roles in the `profiles` table to NULL  
✅ Creates the `roles` table (if it doesn't exist)  
✅ Sets up proper RLS policies  
✅ Inserts 5 standard roles:
   - Member
   - Logistics
   - Volunteer
   - Ministry Leader
   - Administrator

---

## Step 2: Verify the Changes

After running the migration:

1. **Check the Settings Page**
   - Go to Dashboard → Settings → User Roles
   - You should see the 5 standard roles listed
   - All should show "0 users with this role" (since we reset them)

2. **Test Adding a New Role**
   - Click "Add Role"
   - Enter a name and description
   - Click "Create Role"
   - The modal should close and the role should appear in the list

3. **Test Editing a Role**
   - Click the edit icon on any role
   - Change the name or description
   - Click "Save Changes"
   - The modal should close and changes should be reflected

4. **Test the Signup Form**
   - Go to the Signup page
   - The role dropdown should now show the roles from the database
   - If you add a new role in Settings, it will automatically appear here

---

## How It Works Now

### Single Source of Truth
- **Before**: Roles were hardcoded in the signup form
- **After**: Roles are stored in the database and fetched dynamically

### Role Management Flow
1. Admin adds/edits roles in **Settings → User Roles**
2. Roles are saved to the `roles` table in Supabase
3. Signup form automatically fetches and displays these roles
4. New users can only select from the defined roles

### No More Legacy Roles
- All existing user roles have been reset to NULL
- Users will need to be assigned roles through the admin interface
- No more mismatches between signup form and database

---

## Next Steps

### Assign Roles to Existing Users
You'll need to assign roles to your existing users. You can do this by:

1. **Through the Members Page** (if you have one)
   - Edit each user's profile
   - Select their role from the dropdown

2. **Through SQL** (bulk update)
   ```sql
   -- Example: Set all users to "Member" role
   UPDATE public.profiles SET role = 'Member';
   
   -- Or set specific users
   UPDATE public.profiles 
   SET role = 'Administrator' 
   WHERE email = 'admin@example.com';
   ```

### Add More Roles
- Go to Settings → User Roles
- Click "Add Role"
- Enter the role name and description
- The new role will automatically appear in the signup form

---

## Troubleshooting

### "No roles showing in signup form"
- Check that the migration ran successfully
- Verify roles exist: `SELECT * FROM public.roles;`
- Check browser console for errors

### "Can't edit roles"
- Make sure you're logged in as an authenticated user
- Check RLS policies are enabled
- Verify the role has an ID (not a legacy role)

### "Signup form shows old hardcoded roles"
- Clear your browser cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check that the Signup.tsx changes were saved

---

## Summary of Changes Made

### Files Modified:
1. **Settings.tsx** - Fixed add/edit role functionality
2. **Signup.tsx** - Made role dropdown dynamic
3. **migrations/reset_user_roles.sql** - New migration file

### Key Improvements:
✅ Roles are now managed from a single location (Settings page)  
✅ No more duplicate roles when editing  
✅ Signup form automatically stays in sync with defined roles  
✅ Clean database with no legacy roles  
✅ Proper error handling and user feedback
