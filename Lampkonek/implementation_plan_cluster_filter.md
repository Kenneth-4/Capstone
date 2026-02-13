# Implementation Plan - Switch Attendance Filter to Cluster

The user wants to change the filter in the `AttendanceChecklistModal` from filtering by **Ministry** to filtering by **Cluster**.

## User Review Required

> [!NOTE]
> This change will replace the 'Ministry' filter with a 'Cluster' filter in the attendance checklist modal. The table column will also be updated to show 'Cluster' instead of 'Ministry' to align with the active filter.

## Proposed Changes

### Frontend `AttendanceChecklistModal.tsx`
1.  **Update Interface**:
    - Add `cluster: string;` to the `Member` interface.
2.  **Update State**:
    - Rename `ministryFilter` to `clusterFilter`.
    - Initialize with `All`.
3.  **Update Data Fetching**:
    - In `fetchMembersAndAttendance`, map the `cluster` field from the profile data to the `Member` object.
    - Default `cluster` to 'Unassigned' or 'None' if missing.
4.  **Update Filter Logic**:
    - Generate unique `clusters` list instead of `ministries`.
    - Update `filteredEmployees` to filter by `clusterFilter` against `emp.cluster`.
5.  **Update UI**:
    - Change the dropdown to use `clusters` and `clusterFilter`.
    - Update the table header from "Ministry" to "Cluster".
    - Update the table row to display `emp.cluster` instead of `emp.ministry`.

## Verification Plan

### Manual Verification
- Open "Attendance" page.
- Click "Take Attendance" -> "Checklist".
- **Verify**:
    - The dropdown filter now shows "All" and available clusters (e.g., "Cluster A", "Cluster B").
    - Selecting a cluster filters the list correctly.
    - The table column shows "Cluster" instead of "Ministry".
    - The data in the column corresponds to the member's cluster.
