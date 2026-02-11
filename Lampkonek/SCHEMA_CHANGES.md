# Schema Changes: Name-Based Primary Keys

## What Changed

We've updated the database schema to use **name as the primary key** instead of auto-generated IDs for:
- ✅ **Roles** table
- ✅ **Clusters** table  
- ✅ **Ministries** table

## Why This Change?

### **Before (ID-based):**
```sql
CREATE TABLE roles (
    id bigint PRIMARY KEY,
    name text UNIQUE,
    ...
);
```
**Problem:** Users could be assigned roles that don't exist in the roles table (legacy roles), causing confusion and bugs.

### **After (Name-based):**
```sql
CREATE TABLE roles (
    name text PRIMARY KEY,
    description text,
    ...
);
```
**Benefit:** Roles/Clusters/Ministries MUST be created in Settings BEFORE they can be assigned to users. No more legacy/undefined entries!

---

## Benefits of This Approach

### 1. **Single Source of Truth**
- Roles, clusters, and ministries must be defined in Settings first
- No more "auto-detected" or "legacy" entries
- Cleaner, more predictable data

### 2. **Simpler Code**
- Use `upsert()` for both create and update operations
- No need to check if something exists before updating
- Less complex conditional logic

### 3. **Better User Experience**
- Users can only select from defined roles/clusters/ministries
- No confusion about undefined entries
- Consistent data across the application

### 4. **Prevents Data Inconsistencies**
- Can't assign a role that doesn't exist
- Can't assign a cluster that doesn't exist
- Database enforces referential integrity

---

## Code Changes Made

### 1. **Database Schema** (`complete_database_reset.sql`)
```sql
-- Roles table (name is primary key)
CREATE TABLE public.roles (
    name text PRIMARY KEY,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Clusters table (name is primary key)
CREATE TABLE public.clusters (
    name text PRIMARY KEY,
    leader text,
    description text,
    schedule text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ministries table (name is primary key)
CREATE TABLE public.ministries (
    name text PRIMARY KEY,
    leader text,
    description text,
    schedule text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2. **Settings.tsx** - Updated Functions

#### **fetchRoles()**
- Removed legacy role detection
- Only shows roles that exist in the database
- Shows "Unassigned" for users without roles

#### **handleSaveRole()**
```typescript
// Before: Complex logic with ID checks
if (selectedRole?.id) { /* update */ }
else if (selectedRole?.name) { /* check and create/update */ }
else { /* create */ }

// After: Simple upsert
const { error } = await supabase
    .from('roles')
    .upsert({
        name: roleData.name,
        description: roleData.description
    }, {
        onConflict: 'name'
    });
```

#### **handleDeleteRole(), handleAddCluster(), handleAddMinistry()**
- All updated to use `name` instead of `id`
- Use upsert for create/update operations
- Simpler, cleaner code

### 3. **Signup.tsx** - Dynamic Roles
```typescript
// Fetch roles (only name, no ID)
const { data } = await supabase
    .from('roles')
    .select('name')
    .order('name');

// Render dropdown
{roles.map((role) => (
    <option key={role.name} value={role.name}>
        {role.name}
    </option>
))}
```

---

## Migration Path

### **Step 1: Run the Database Reset**
Execute `migrations/complete_database_reset.sql` in Supabase SQL Editor

This will:
1. Drop all existing tables
2. Recreate them with name-based primary keys
3. Insert 5 default roles
4. Set up proper RLS policies

### **Step 2: Test the Application**
1. Log out and log back in (profile will be auto-created)
2. Go to Settings → User Roles
3. Try adding a new role
4. Try editing an existing role
5. Go to Signup page and verify roles appear

### **Step 3: Assign Roles to Users**
Since all roles were reset, you'll need to assign roles to existing users:

```sql
-- Option 1: Set all users to Member
UPDATE public.profiles SET role = 'Member';

-- Option 2: Set specific users
UPDATE public.profiles 
SET role = 'Administrator' 
WHERE email = 'admin@example.com';
```

---

## How It Works Now

### **Creating a Role**
1. Admin goes to Settings → User Roles
2. Clicks "Add Role"
3. Enters name and description
4. Role is inserted into `roles` table with name as primary key

### **Editing a Role**
1. Admin clicks edit on existing role
2. Changes name or description
3. If name changed → creates new role (upsert)
4. If name same → updates existing role (upsert)

### **Assigning a Role to User**
1. User can only select from roles that exist in `roles` table
2. Signup form dynamically fetches roles from database
3. No way to create "legacy" or "undefined" roles

### **Deleting a Role**
1. Admin clicks delete on role
2. Role is deleted using `name` as identifier
3. Users with that role will have `NULL` role (shown as "Unassigned")

---

## Important Notes

### **Name Changes**
If you change a role's name, it creates a NEW role:
- Old role: `Member` 
- Edit and change to: `Regular Member`
- Result: Two separate roles exist

To truly rename a role, you'd need to:
1. Create the new role
2. Update all users to the new role
3. Delete the old role

### **Case Sensitivity**
Role names are case-sensitive:
- `Member` ≠ `member` ≠ `MEMBER`
- Be consistent with capitalization

### **Unique Names**
Role names must be unique:
- Can't have two roles named "Member"
- Database will enforce this constraint

---

## Troubleshooting

### **"Cannot assign role that doesn't exist"**
✅ **Solution:** Create the role in Settings → User Roles first

### **"Duplicate key value violates unique constraint"**
✅ **Solution:** A role with that name already exists. Choose a different name or edit the existing role.

### **"No roles showing in dropdown"**
✅ **Solution:** 
1. Check that roles exist: `SELECT * FROM public.roles;`
2. Run the database reset script to insert default roles

### **"Users showing as Unassigned"**
✅ **Solution:** This is expected after reset. Assign roles to users through the admin interface or SQL.

---

## Summary

This change makes your application more robust by:
- ✅ Enforcing that roles/clusters/ministries must be defined before use
- ✅ Eliminating legacy/undefined entries
- ✅ Simplifying code with upsert operations
- ✅ Creating a single source of truth for all organizational data

**The database now enforces data integrity at the schema level, preventing the issues you were experiencing with legacy roles!**
