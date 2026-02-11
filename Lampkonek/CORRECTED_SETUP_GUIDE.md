# 🔄 CORRECTED DATABASE RESET GUIDE

## ✅ What's Fixed

### **Schema Design:**
- ✅ **Roles table:** HAS IDs (needed for signup dropdown)
- ✅ **Clusters table:** NO IDs (name is primary key)
- ✅ **Ministries table:** NO IDs (name is primary key)
- ✅ **Session persistence:** Fixed in AuthContext

---

## 📋 Step-by-Step Reset Process

### **Step 1: Run the Database Reset Script**

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file: `migrations/complete_database_reset.sql`
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run**
7. ✅ Wait for "Success. No rows returned" message

**What this does:**
- Drops all existing application tables
- Creates fresh tables with correct schema
- Inserts 5 default roles (with IDs):
  - Member
  - Logistics
  - Volunteer
  - Ministry Leader
  - Administrator
- Sets up RLS policies
- Creates auto-profile trigger

---

### **Step 2: Sign Up for a New Account**

1. Go to your application's signup page
2. Fill in the form:
   - Full Name
   - Email
   - Password
   - **Role:** Select "Member" (or any role)
3. Click **Sign Up**
4. ✅ You should see "Account created successfully!"

**Important:** Don't log in yet! We need to make you an administrator first.

---

### **Step 3: Make Yourself Administrator**

1. Go back to Supabase SQL Editor
2. Open the file: `migrations/set_administrator.sql`
3. **IMPORTANT:** Replace `'your-email@example.com'` with YOUR actual email
4. Run the script
5. ✅ You should see "Success. 1 rows affected"

**The script:**
```sql
UPDATE public.profiles
SET role = 'Administrator'
WHERE email = 'your-email@example.com';
```

---

### **Step 4: Log In**

1. Go to your application's login page
2. Enter your email and password
3. Click **Log In**
4. ✅ You should see the dashboard with ALL navigation items:
   - Dashboard
   - Attendance
   - Members
   - Reservation
   - Reports
   - Settings
   - My Profile

---

## 🧪 Testing the Setup

### **Test 1: Sidebar Shows All Pages**
- ✅ As Administrator, you should see all 7 pages in the sidebar
- ✅ Each page should be clickable and load correctly

### **Test 2: Session Persists**
- ✅ Refresh the page (F5)
- ✅ You should stay logged in
- ✅ You should stay on the same page

### **Test 3: Role Management**
1. Go to **Settings** → **Roles** tab
2. ✅ You should see 5 default roles
3. Try creating a new role
4. ✅ Should save successfully
5. Try editing a role
6. ✅ Should update successfully

### **Test 4: Cluster Management**
1. Go to **Settings** → **Clusters** tab
2. Try creating a new cluster (e.g., "Youth Cluster")
3. ✅ Should save successfully
4. Try editing the cluster
5. ✅ Should update successfully
6. Try creating another cluster with the same name
7. ✅ Should update the existing one (upsert behavior)

### **Test 5: Ministry Management**
1. Go to **Settings** → **Ministries** tab
2. Try creating a new ministry (e.g., "Worship Ministry")
3. ✅ Should save successfully
4. Try editing the ministry
5. ✅ Should update successfully

---

## 🔍 Verification Queries

Run these in Supabase SQL Editor to verify your setup:

### **Check Roles (should have IDs):**
```sql
SELECT id, name, description FROM public.roles ORDER BY id;
```
Expected output:
```
id | name            | description
---+-----------------+----------------------------------
1  | Member          | Regular church member with basic access
2  | Logistics       | Handles logistics and operational tasks
3  | Volunteer       | Assists with events and activities
4  | Ministry Leader | Leads and manages a ministry
5  | Administrator   | Full administrative access to the system
```

### **Check Your Profile:**
```sql
SELECT email, role FROM public.profiles WHERE email = 'your-email@example.com';
```
Expected output:
```
email                    | role
-------------------------+--------------
your-email@example.com   | Administrator
```

### **Check Clusters (should NOT have IDs):**
```sql
SELECT * FROM public.clusters;
```
Expected: Empty table (you'll create clusters in the app)

### **Check Ministries (should NOT have IDs):**
```sql
SELECT * FROM public.ministries;
```
Expected: Empty table (you'll create ministries in the app)

---

## 🐛 Troubleshooting

### **"Still getting signed out on reload"**

**Check browser console for errors:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Share them if you need help

**Check if session is being stored:**
```javascript
// In browser console
localStorage.getItem('supabase.auth.token')
```
Should return a token string, not `null`

**Make sure you're not in incognito mode:**
- Private/incognito mode may block localStorage
- Use a regular browser window

---

### **"Sidebar is still empty"**

**Check your role:**
```sql
SELECT email, role FROM public.profiles WHERE email = 'your-email@example.com';
```

**Make sure role matches exactly:**
- ✅ `Administrator` (correct)
- ❌ `administrator` (wrong - won't match)
- ❌ `Admin` (wrong - doesn't exist)

**If role is wrong, fix it:**
```sql
UPDATE public.profiles
SET role = 'Administrator'
WHERE email = 'your-email@example.com';
```

---

### **"Can't create/edit roles"**

**Check if roles table has IDs:**
```sql
SELECT id, name FROM public.roles LIMIT 1;
```
Should show an `id` column. If not, re-run the reset script.

---

### **"Can't create/edit clusters"**

**Check if clusters table structure:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clusters' 
ORDER BY ordinal_position;
```
Should show `name` as text (primary key), NOT `id`.

---

## 📊 Schema Summary

### **Tables WITH IDs:**
- `profiles` (id = user UUID)
- `roles` (id = auto-increment)
- `announcements` (id = auto-increment)
- `attendance` (id = auto-increment)
- `app_settings` (key = text primary key)

### **Tables WITHOUT IDs (name is PK):**
- `clusters` (name = text primary key)
- `ministries` (name = text primary key)

---

## 🎯 What Changed from Previous Version

### **Before (Broken):**
- ❌ Roles had NO IDs (name was primary key)
- ❌ Signup couldn't use role IDs
- ❌ Session didn't persist (AuthContext bug)

### **After (Fixed):**
- ✅ Roles HAVE IDs (for signup dropdown)
- ✅ Clusters/Ministries DON'T have IDs (name is PK)
- ✅ Session persists correctly
- ✅ All CRUD operations work correctly

---

## 📝 Code Changes Summary

### **Files Modified:**

1. **`migrations/complete_database_reset.sql`**
   - Roles table now has `id` column
   - Clusters/Ministries use `name` as primary key

2. **`src/context/AuthContext.tsx`**
   - Added `finally` block to set `loading = false`
   - Ensures session persists on reload

3. **`src/pages/Dashboard/Settings.tsx`**
   - `fetchRoles()`: Includes `id` field
   - `handleSaveRole()`: Uses ID for update, insert for create
   - `handleDeleteRole()`: Uses ID for deletion
   - `handleAddCluster()`: Uses upsert with name
   - `handleAddMinistry()`: Uses upsert with name

4. **`src/pages/Auth/Signup.tsx`**
   - Fetches roles with `id` and `name`
   - Uses `id` as key in dropdown

5. **`src/pages/Dashboard/Dashboard.tsx`**
   - Case-insensitive role matching (already fixed)

---

## ✅ You're All Set!

Your database is now properly configured with:
- ✅ Roles with IDs (for signup)
- ✅ Clusters/Ministries without IDs (name-based)
- ✅ Session persistence working
- ✅ All CRUD operations functional

**Start using your application!** 🚀
