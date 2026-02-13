# Implementation Plan - Rename Volunteer Role to Pastor

The user wants to rename the **Volunteer** role to **Pastor** in the Settings module. This change needs to be reflected in the database.

## User Review Required

> [!NOTE]
> This change will permanently rename the 'Volunteer' role to 'Pastor'. Any users currently assigned the 'Volunteer' role will now have the 'Pastor' role.

## Proposed Changes

### Database Migration
- Create a new migration script `migrations/rename_volunteer_role.sql` to:
    - Update the `roles` table: Set `name` = 'Pastor' and update description where `name` = 'Volunteer'.
    - Update the `profiles` table: Set `role` = 'Pastor' where `role` = 'Volunteer' (to maintain data integrity for existing users).

### Verification Plan

### Manual Verification
- Run the migration in the Supabase SQL Editor.
- Go to the **Settings** page in the dashboard.
- Select **User Roles**.
- **Verify**:
    - "Volunteer" is no longer listed.
    - "Pastor" is listed with the updated description.
    - Check if the count of users for "Pastor" matches what was previously "Volunteer" (if any).
