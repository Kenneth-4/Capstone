# Implementation Plan - Add Searchable Member Dropdown

The user wants to replace the standard "Member Name" dropdown in the `AddAttendanceModal` with a searchable text field that filters the list of members.

## User Review Required

> [!NOTE]
> The "Member Name" dropdown will be replaced with a search input. Users can type to filter the list and select a member from the dropdown that appears.

## Proposed Changes

### Frontend `AddAttendanceModal.tsx`
1.  **Add State**:
    - `searchTerm`: To store the user's input.
    - `isDropdownOpen`: To control the visibility of the suggestions list.
2.  **Update UI**:
    - Replace the `<select>` element for Member Name with a custom component structure:
        - An `<input type="text">` for searching/typing.
        - A `<div>` or `<ul>` acting as the dropdown list, positioned absolutely below the input.
    - The dropdown list will map over filtered members.
3.  **Implement Logic**:
    - **Filtering**: Filter `members` based on `searchTerm`.
    - **Selection**: When a user clicks an item:
        - Set `memberId`.
        - Set `searchTerm` to the selected member's name.
        - Close the dropdown.
    - **Focus/Blur**: Show dropdown on focus, hide on selection or outside click (simplified to just selection for now to avoid complexity with blur/click conflicts, or use a backdrop).

### CSS `AddAttendanceModal.css`
- Add styles for the new dropdown list:
    - Absolute positioning.
    - Z-index to float above other elements.
    - Max-height and scrolling.
    - Hover effects for items.

## Verification Plan

### Manual Verification
- Open "Attendance" page.
- Click "Take Attendance" -> "Take Attendance" (Add single record).
- **Verify**:
    - The "Member Name" field is now a text input.
    - Typing filters the list of members.
    - Clicking a member from the list fills the input and sets the ID.
    - The record can be saved successfully.
