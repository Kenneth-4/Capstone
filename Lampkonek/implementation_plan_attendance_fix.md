# Implementation Plan - Fix Attendance Save Error

The user is encountering a "Bad Request" (400) error with code `42P10` when saving attendance. This error indicates a missing unique constraint on the `attendance` table that matches the `ON CONFLICT` clause used in the `upsert` operation.

## User Review Required

> [!IMPORTANT]
> A new database migration file `migrations/fix_attendance_constraint.sql` has been created. You **must run this SQL script** in your Supabase SQL Editor to apply the necessary database constraints.

- **Migration File:** `migrations/fix_attendance_constraint.sql`
- **Action:** Run the SQL in Supabase SQL Editor.

## Proposed Changes

### Database
- Create a migration to:
    - Add `event` and `remarks` columns to `attendance` table if missing.
    - Set default value for `event` column to `''` (empty string) to ensure uniqueness works correctly.
    - Add a unique constraint `unique_attendance_record` on `(user_id, date, event)`.

### Frontend
- **Update `AttendanceChecklistModal.tsx`**:
    - Modify the `upsert` call to use `onConflict: 'user_id,date,event'` to match the new database constraint.

## Verification Plan

### Automated Tests
- None (Manual verification required as I cannot run DB tests directly).

### Manual Verification
- Open the "Attendance" page.
- Open "Take Attendance" -> "Checklist".
- Select a date and event.
- Mark some users as Present/Absent.
- Click "Save Attendance".
- **Expected Result:** Success message "Attendance saved successfully" and no 400 error in console.
