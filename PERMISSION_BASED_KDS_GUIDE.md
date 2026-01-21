# Permission-Based Kitchen Display System (KDS) Implementation

## Overview

The Kitchen Display System now uses granular permissions instead of role-based access control. This allows admin users to control exactly which staff members can perform specific KDS actions.

## New Permissions Added

Three new permissions have been added to the system:

1. **mark_order_preparing**
   - Allows users to mark pending orders as "preparing"
   - Category: order_management
   - Default: Granted to chef role

2. **mark_order_ready**
   - Allows users to mark preparing orders as "ready for pickup"
   - Category: order_management
   - Default: Granted to chef role

3. **confirm_order_delivery**
   - Allows users to mark ready orders as "delivered" and generate bills
   - Category: order_management
   - Default: Granted to chef role

## Changes Made

### Backend Changes

**1. Added Permission Creation Endpoint**

- Endpoint: `POST /api/permissions`
- Admin-only endpoint to create new permissions programmatically
- Request body:
  ```json
  {
    "name": "permission_name",
    "description": "Human-readable description",
    "category": "order_management"
  }
  ```

**2. Updated Setup Script**

- File: `backend/scripts/setupPermissions.js`
- Added 3 new permissions to the PERMISSIONS array
- Updated chef role to include the 3 new KDS permissions
- Chef role now has:
  - view_menu
  - view_orders
  - mark_order_preparing
  - mark_order_ready
  - confirm_order_delivery
  - kitchen_display

### Frontend Changes

**1. KitchenDisplaySystem.jsx Refactored**

- New permission fetching on component mount
- Permission checks before button rendering
- Disabled buttons with tooltip for users without permission
- Shows error notification if user attempts action without permission

**New Functions:**

- `fetchPermissions()` - Fetches user's permissions from `/api/my-permissions`
- `hasPermission(permissionName)` - Checks if user has a specific permission

**Button States:**

- ✅ **Mark Preparing** - Only shows if user has `mark_order_preparing` permission
- ✅ **Mark Ready** - Only shows if user has `mark_order_ready` permission
- ✅ **Mark Delivered** - Only shows if user has `confirm_order_delivery` permission

Buttons are greyed out and disabled if user lacks permission, with a helpful tooltip explaining why.

**2. Removed WaiterDeliveryPanel**

- Removed import from App.jsx
- Removed 'waiter-delivery' case from switch statement
- Removed 🚚 Delivery menu item from Sidebar
- User workflow: Waiters now create orders, chefs mark them ready, and orders automatically transition through the system

### Database Changes

No direct database changes required - the setupPermissions.js script handles creating the new permissions when run.

## How Admins Control KDS Access

### Via Permission Management UI

1. Go to Admin Panel → Permission Management
2. Select a role (e.g., chef, waiter, manager)
3. Check/uncheck the KDS permissions:
   - mark_order_preparing
   - mark_order_ready
   - confirm_order_delivery
4. Save the role

### Important Notes

- **Admin Role**: Automatically has all permissions (indicated by "\*")
- **Chef Role**: By default has all 3 KDS permissions
- **Waiter Role**: By default does NOT have KDS permissions (can still create orders and handle billing)
- **Custom Roles**: Admins can create custom roles and assign specific permissions

## Testing the New System

### Prerequisites

1. Run the setup script to initialize permissions:

   ```bash
   node backend/scripts/setupPermissions.js
   ```

2. Login as admin or user with `kitchen_display` permission

### Test Scenarios

**Test 1: Chef with Full KDS Permissions**

1. Login as chef user
2. Navigate to Kitchen Display System
3. All three buttons should be enabled:
   - ✅ Mark Preparing
   - ✅ Mark Ready
   - ✅ Mark Delivered

**Test 2: Waiter without KDS Permissions**

1. Create a custom waiter or remove permissions from waiter role
2. Login as waiter user
3. Navigate to Kitchen Display System
4. All buttons should be greyed out with message:
   - "❌ You don't have permission to mark orders as preparing"

**Test 3: Admin Control**

1. Login as admin
2. Go to Permission Management
3. Remove `mark_order_ready` from chef role
4. Save changes
5. Logout and login as chef
6. In KDS, only 2 buttons should be enabled (not "Mark Ready")

**Test 4: Permission Error Handling**

1. Without required permission, click a disabled button
2. Should see notification: "❌ You don't have permission to..."

## API Endpoints

### Get User Permissions

```
GET /api/my-permissions
Headers: Authorization: Bearer <token>
Response:
{
  "permissions": ["view_menu", "view_orders", "mark_order_preparing", ...],
  "role": "chef"
}
```

### Create New Permission

```
POST /api/permissions
Headers: Authorization: Bearer <token>
Body:
{
  "name": "permission_name",
  "description": "Description",
  "category": "order_management"
}
```

### Assign Permissions to Role

```
PUT /api/roles/:roleId/permissions
Headers: Authorization: Bearer <token>
Body:
{
  "permissions": ["view_menu", "mark_order_preparing", ...]
}
```

## Removed Components

**WaiterDeliveryPanel.jsx** - No longer in use

- This component is still present in the codebase but is not imported or used
- It can be deleted if needed, as the delivery workflow is now handled by KDS buttons with permission checks
- The BillingPage now automatically shows delivered orders without needing the separate delivery panel

## Benefits of This Approach

1. **Fine-grained Control**: Admins can grant/revoke individual KDS actions per user
2. **Flexible**: Easy to create custom roles with specific permission combinations
3. **Audit Trail**: Each permission is tracked, making it easy to understand who can do what
4. **Scalable**: New permissions can be added easily without code changes
5. **User-Friendly**: Buttons are visually disabled, not hidden, so users know what permissions they need

## Troubleshooting

### Buttons Not Appearing

1. Ensure user has the `kitchen_display` permission
2. Check that role includes the specific KDS permission
3. Verify token is valid and user is properly authenticated

### 404 on Confirm Delivery

1. Ensure order exists in database and has "ready" status
2. Check that `Bill` model is properly imported in server.js
3. Verify JWT token is included in request header

### Permissions Not Updating

1. Run setupPermissions.js script to ensure permissions exist in database
2. Clear browser cache and re-login
3. Verify admin user has permission to manage roles

## Migration from Old System

If you were previously using the WaiterDeliveryPanel:

1. Orders can still be delivered through KDS buttons (if user has permission)
2. Bills are automatically generated when order is marked as delivered
3. Billing page still works and shows all delivered orders
4. No data loss - existing orders and bills are unaffected

## Next Steps

1. ✅ Backend API updated with new permissions
2. ✅ Frontend KDS component updated with permission checks
3. ✅ Setup script updated with new permissions
4. **TODO**: Run `node backend/scripts/setupPermissions.js` to initialize the database
5. **TODO**: Test the permission system with different user roles
6. **TODO**: Optionally delete `WaiterDeliveryPanel.jsx` file if no longer needed
