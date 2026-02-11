# 🔄 Complete Database Reset Guide

## ⚠️ WARNING
This will **DELETE ALL DATA** in your application tables including:
- ❌ All user profiles
- ❌ All attendance records
- ❌ All announcements
- ❌ All clusters and ministries
- ❌ All custom roles (except the 5 default ones)
- ❌ All app settings (except defaults)

**What is NOT deleted:**
- ✅ Your login accounts (auth.users) - you can still log in
- ✅ User profiles will be auto-recreated when users log in again

---

## 📋 How to Reset Your Database

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Reset Script
1. Click **New Query**
2. Open the file: `migrations/complete_database_reset.sql`
3. Copy the **ENTIRE** script
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

### Step 3: Wait for Completion
- The script will take a few seconds to run
- You should see a success message with:
  - List of tables created
  - 5 default roles
  - 2 app settings

### Step 4: Verify the Reset
At the bottom of the results, you should see:
```
✅ 7 tables created (profiles, roles, clusters, ministries, announcements, attendance, app_settings)
✅ 5 roles inserted
✅ 2 app settings inserted
```

---

## 🎯 What Happens After Reset

### Immediate Effects:
1. **All tables are recreated** with clean schema
2. **5 default roles** are added:
   - Member
   - Logistics
   - Volunteer
   - Ministry Leader
   - Administrator
3. **Default app settings** are restored
4. **RLS policies** are properly configured
5. **Auto-profile creation** trigger is set up

### When Users Log In:
- Their profile will be **automatically recreated** from their auth data
- They'll need to be assigned a role again (will be NULL initially)
- All their previous data (attendance, etc.) is gone

---

## 🚀 After the Reset

### 1. Test Your Login
- Log out of your application
- Log back in
- Your profile should be automatically created

### 2. Check the Settings Page
- Go to Dashboard → Settings → User Roles
- You should see 5 default roles
- Try adding a new role to test

### 3. Check the Signup Page
- Go to the Signup page
- The role dropdown should show the 5 default roles
- Try creating a test account

### 4. Assign Roles to Users
Since all roles were reset, you'll need to:
- Go to your Members/Users page
- Assign roles to each user
- Or use SQL to bulk assign:
  ```sql
  -- Set all users to Member role
  UPDATE public.profiles SET role = 'Member';
  ```

---

## 🔧 Troubleshooting

### "Error: relation does not exist"
- Make sure you copied the ENTIRE script
- Run it again - it's safe to run multiple times

### "Permission denied"
- Make sure you're logged into the correct Supabase project
- Check that you have admin access

### "Profile not created after login"
- Check the trigger exists:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- If missing, run the script again

### "Can't see any roles in Settings"
- Check roles exist:
  ```sql
  SELECT * FROM public.roles;
  ```
- If empty, run the INSERT statements again

---

## 📊 What the Script Does (Technical Details)

1. **Drops all tables** (CASCADE removes dependencies)
2. **Creates tables** with proper schema:
   - profiles (user data)
   - roles (role definitions)
   - clusters (cluster management)
   - ministries (ministry management)
   - announcements (announcements)
   - attendance (attendance tracking)
   - app_settings (application settings)

3. **Enables RLS** on all tables
4. **Creates policies** for authenticated users
5. **Inserts default data** (roles and settings)
6. **Creates trigger** to auto-create profiles on signup
7. **Verifies** everything was created correctly

---

## 🎉 You're All Set!

After running this script, you have:
- ✅ Clean database with proper schema
- ✅ Working role management system
- ✅ Auto-profile creation on signup
- ✅ Proper RLS security
- ✅ Default roles and settings

**Your application is now ready to use with a fresh start!**

---

## 💡 Need Help?

If something goes wrong:
1. Check the error message in the SQL Editor
2. Make sure you ran the ENTIRE script
3. Try running it again (it's idempotent - safe to run multiple times)
4. Check that you're in the correct Supabase project

**The script is designed to be safe and can be run multiple times without issues.**
