# 🚀 Complete Setup Guide - Fresh Start

## Overview
This guide will help you:
1. ✅ Reset your database completely
2. ✅ Create your admin account
3. ✅ Set yourself as Administrator
4. ✅ Start using the application

---

## 📋 Step-by-Step Instructions

### **Step 1: Reset the Database**

1. Open your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file: `migrations/complete_database_reset.sql`
6. Copy the **ENTIRE** script and paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for completion - you should see tables created and default roles inserted

**What this does:**
- Drops all existing tables
- Creates fresh tables with proper schema
- Inserts 5 default roles (Member, Logistics, Volunteer, Ministry Leader, Administrator)
- Sets up RLS policies
- Creates auto-profile trigger

---

### **Step 2: Create Your Admin Account**

1. Go to your application's **Signup page**
2. Fill in your details:
   - Full Name: `Your Name`
   - Email: `your-email@example.com` (remember this!)
   - Role: Select **Administrator** (or any role, we'll change it next)
   - Password: Create a strong password
   - Confirm Password: Same password
3. Click **Sign Up**
4. You'll be redirected to login - **don't log in yet**

---

### **Step 3: Set Yourself as Administrator**

1. Go back to **Supabase SQL Editor**
2. Click **New Query**
3. Open the file: `migrations/set_administrator.sql`
4. Copy the script
5. **IMPORTANT:** Replace `'your-email@example.com'` with your actual email (keep the quotes)
   ```sql
   UPDATE public.profiles 
   SET role = 'Administrator' 
   WHERE email = 'kenneth@example.com';  -- Your actual email here
   ```
6. Click **Run**
7. You should see your profile with `role = 'Administrator'`

---

### **Step 4: Log In and Test**

1. Go to your application's **Login page**
2. Log in with your email and password
3. You should be redirected to the Dashboard
4. Go to **Settings → User Roles**
   - You should see 5 default roles
   - Try adding a new role to test
5. Go to **Settings → Clusters**
   - Try adding a cluster
6. Go to **Settings → Ministries**
   - Try adding a ministry

---

## 🎯 What You Can Do Now

### **As Administrator, you have full access to:**

1. **Dashboard** - View overview and statistics
2. **Members** - Manage all church members
3. **Attendance** - Track and manage attendance
4. **Reports** - View analytics and reports
5. **Settings** - Full access to:
   - General Settings
   - User Roles Management
   - Clusters Management
   - Ministries Management
   - Announcements
   - Backup & Restore

### **Next Steps:**

1. **Add More Roles** (if needed)
   - Go to Settings → User Roles
   - Click "Add Role"
   - Create custom roles for your organization

2. **Add Clusters**
   - Go to Settings → Clusters
   - Click "Add Cluster"
   - Define your church clusters

3. **Add Ministries**
   - Go to Settings → Ministries
   - Click "Add Ministry"
   - Define your church ministries

4. **Invite Other Users**
   - Share the signup link
   - They can select their role during signup
   - You can change their roles later in the Members page

5. **Assign Roles to Existing Users** (if any)
   - Use SQL or the Members page to assign roles

---

## 🔐 Security Notes

### **Password Security**
- Use a strong password for your admin account
- Don't share your admin credentials
- Consider using a password manager

### **Role-Based Access**
Currently, all authenticated users can access all pages. If you want to restrict access based on roles:
- Let me know and I can implement role-based access control (RBAC)
- For example: Only Administrators can access Settings

### **Supabase Access**
- Keep your Supabase credentials secure
- Don't share your project URL and anon key publicly
- Use environment variables for sensitive data

---

## 🆘 Troubleshooting

### **"Can't log in after signup"**
✅ Make sure you completed Step 3 (set as administrator)
✅ Check that the email matches exactly

### **"No roles showing in Settings"**
✅ Run the database reset script again
✅ Check: `SELECT * FROM public.roles;` in SQL Editor

### **"Profile not created after signup"**
✅ Check the trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
✅ Run the database reset script again

### **"Can't access Settings page"**
✅ Make sure you're logged in
✅ Verify your role is set to 'Administrator' in the database

---

## 📊 Quick Reference

### **Default Roles Created:**
1. Member
2. Logistics
3. Volunteer
4. Ministry Leader
5. Administrator

### **Admin Capabilities:**
- ✅ Manage all users
- ✅ Create/edit/delete roles
- ✅ Create/edit/delete clusters
- ✅ Create/edit/delete ministries
- ✅ Manage announcements
- ✅ View all reports
- ✅ Access all settings

### **Important Files:**
- `migrations/complete_database_reset.sql` - Full database reset
- `migrations/set_administrator.sql` - Promote user to admin
- `DATABASE_RESET_GUIDE.md` - Detailed reset guide
- `SCHEMA_CHANGES.md` - Technical documentation

---

## 🎉 You're All Set!

After completing these steps, you'll have:
- ✅ Clean database with proper schema
- ✅ Administrator account with full access
- ✅ Working role management system
- ✅ Ready to add users, clusters, and ministries

**Your application is now ready for production use!** 🚀

---

## 💡 Need More Help?

If you want to:
- Implement role-based access control
- Add more features to the admin panel
- Customize the roles and permissions
- Set up automated backups

Just let me know and I'll help you implement it! 😊
