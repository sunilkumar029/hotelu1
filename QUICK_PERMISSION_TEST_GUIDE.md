# Quick Permission Testing Guide

## Setup

Before testing, run the permission setup script:

```bash
cd c:\Users\safik\Downloads\kiran\kiran\backend
node scripts/setupPermissions.js
```

This will create the 3 new KDS permissions and update the chef role.

## Test Credentials

### Chef (Has KDS Permissions)

- Username: `chef1`
- Password: `pass`
- Expected: All KDS buttons enabled ✅

### Waiter (No KDS Permissions by Default)

- Username: `waiter1`
- Password: `pass`
- Expected: All KDS buttons disabled/greyed out

### Admin (Has All Permissions)

- Username: `admin`
- Password: `admin`
- Expected: All buttons enabled, can manage permissions

## Testing Steps

### 1. Test Chef Full Access

1. Start backend: `npm start` in backend folder
2. Start frontend: `npm start` in frontend folder
3. Login as `chef1` / `pass`
4. Navigate to 🍳 Kitchen Display System
5. **Expected**: All 3 buttons enabled (Mark Preparing, Mark Ready, Mark Delivered)
6. Create an order first if needed (use dine-in or takeaway management)
7. Mark order as Preparing → Ready → Delivered
8. **Verify**: Buttons work and order status updates

### 2. Test Waiter No Access

1. Login as `waiter1` / `pass`
2. Navigate to KDS (should be visible in sidebar)
3. **Expected**: See orders but all buttons are greyed out
4. Hover over button → see tooltip: "❌ No permission to mark orders as preparing"
5. Try clicking → see error notification

### 3. Test Permission Management

1. Login as `admin` / `admin`
2. Go to Permission Management (sidebar)
3. Select "chef" role
4. **Current state**: Should see 3 KDS permissions checked:
   - ✅ mark_order_preparing
   - ✅ mark_order_ready
   - ✅ confirm_order_delivery
5. Uncheck "mark_order_ready"
6. Save changes
7. **Verify in browser console**: Should see success message
8. Logout and login as `chef1`
9. Navigate to KDS
10. **Expected**: Only 2 buttons enabled (not "Mark Ready")

### 4. Test API Directly

#### Get User Permissions

```bash
# Get permissions for logged-in user
curl -H "Authorization: Bearer <your_token>" \
  http://localhost:3001/api/my-permissions

# Expected response:
{
  "permissions": ["view_menu", "view_orders", "mark_order_preparing", "mark_order_ready", "confirm_order_delivery", "kitchen_display"],
  "role": "chef"
}
```

#### Create New Permission (Admin Only)

```bash
curl -X POST http://localhost:3001/api/permissions \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test_permission",
    "description": "Test permission",
    "category": "order_management"
  }'
```

#### Update Role Permissions

```bash
# Remove mark_order_ready from chef role
curl -X PUT http://localhost:3001/api/roles/2/permissions \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["view_menu", "view_orders", "mark_order_preparing", "confirm_order_delivery", "kitchen_display"]
  }'
```

## Common Issues & Solutions

### Issue: "❌ Order must be in 'ready' status"

**Solution**: You can only mark orders as delivered if they're in "ready" status

- Order flow: pending → preparing → ready → delivered

### Issue: "404 Order not found"

**Solution**:

- Create an order first (use Dine-In Management)
- Make sure the order ID exists
- Check that you're using the correct token

### Issue: Buttons don't appear/disappear after permission change

**Solution**:

- Clear browser cache (Ctrl+Shift+Delete)
- Or refresh the page (Ctrl+R)
- Or logout and login again
- Check browser console for errors (F12)

### Issue: "Only admins can create permissions"

**Solution**: Make sure you're logged in as admin user, not regular user

## What Changed

### Removed

- ❌ WaiterDeliveryPanel.jsx component (still in file system but not used)
- ❌ 'waiter-delivery' route from App.jsx
- ❌ 🚚 Delivery menu item from Sidebar

### Added

- ✅ 3 new permissions: mark_order_preparing, mark_order_ready, confirm_order_delivery
- ✅ Permission checks in KitchenDisplaySystem component
- ✅ POST /api/permissions endpoint for creating new permissions
- ✅ Visual permission indicators (disabled buttons with tooltips)

### Updated

- ✅ KitchenDisplaySystem.jsx - Now has permission checking logic
- ✅ setupPermissions.js - Includes 3 new KDS permissions
- ✅ Chef role - Now includes all 3 KDS permissions
- ✅ App.jsx - Removed waiter-delivery case
- ✅ Sidebar.jsx - Removed delivery menu item

## Performance Impact

- **Minimal**: One additional API call on KDS mount to fetch permissions
- **Cached**: Permissions are fetched once when component loads
- **Efficient**: Permission check is a simple array lookup

## Next Steps

1. ✅ Run setupPermissions.js
2. ✅ Test with different user roles
3. ✅ Verify permission controls work in admin panel
4. ❓ Optional: Delete WaiterDeliveryPanel.jsx file if not needed
5. ❓ Optional: Create custom roles with specific permission combinations
