# 🍽️ Dine-In Table Synchronization Guide

## Overview

The dine-in table synchronization system ensures that:

1. **Table status updates in real-time** across all pages
2. **Orders are automatically tracked** when customers order
3. **Billing status affects table availability**
4. **All pages stay synchronized** with a 2-second polling interval

---

## System Architecture

### 1. **Table Statuses**

Tables can have the following statuses:

| Status              | Color     | Meaning                                | Actions Available                  |
| ------------------- | --------- | -------------------------------------- | ---------------------------------- |
| **Available**       | 🟢 Green  | Table is empty and ready for customers | Click to place an order            |
| **Occupied**        | 🔴 Red    | Table has active orders being prepared | Click to add more items            |
| **Waiting Payment** | 🟠 Orange | Order delivered, waiting for payment   | Mark as available (after cleaning) |
| **Cleaning**        | 🟡 Yellow | Table is being cleaned after payment   | Auto-transitions to Available      |

### 2. **Order Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                     COMPLETE FLOW                           │
└─────────────────────────────────────────────────────────────┘

1. CUSTOMER ORDERS (SimpleMenu/QRCodeOrdering)
   ├─ Customer scans QR code or uses table menu
   ├─ Adds items to cart
   └─ Places order → Table marked as OCCUPIED

2. KITCHEN PREPARES (KitchenDisplaySystem)
   ├─ Chef sees order on KDS
   ├─ Marks as PREPARING
   └─ Marks as READY when done

3. WAITER DELIVERS (OrderEntryModal/DineInManagement)
   ├─ Waiter confirms delivery
   └─ Order marked as DELIVERED

4. CUSTOMER PAYS (SimpleMenu/BillingPage)
   ├─ Customer pays at table OR
   ├─ Billing page processes payment
   └─ Order marked as PAID (bill_status = 'paid')

5. TABLE CLEANUP (DineInManagement)
   ├─ Staff clicks "Mark Available"
   ├─ Order completion triggered
   └─ Table transitions: WAITING_PAYMENT → CLEANING → AVAILABLE

```

---

## Component Changes Summary

### 1. **DineInManagement.jsx** ✅

**Key Changes:**

- Added `fetchOrdersAndSync()` function that fetches DINE_IN orders every 2 seconds
- Implemented `updateTableStatuses()` to map orders to table statuses:
  - No order → **AVAILABLE**
  - Order not delivered → **OCCUPIED**
  - Order delivered, not paid → **WAITING_PAYMENT**
- Added `getTableStatusLabel()` function for status icons
- Updated table click behavior:
  - OCCUPIED: Click to add more items
  - WAITING_PAYMENT: Show "Mark Available" button

**Real-Time Sync:**

```javascript
// Poll every 2 seconds
const orderInterval = setInterval(fetchOrdersAndSync, 2000);
```

**Status Mapping:**

```javascript
const updateTableStatuses = (orders) => {
  // Maps orders to table statuses automatically
  // No code needed to manually update table status
};
```

---

### 2. **SimpleMenu.jsx** ✅

**Key Changes:**

- Added `fetchActiveOrders()` function to fetch table's orders every 2 seconds
- Display "Your Active Orders" section showing:
  - Order number and status (⏳ Pending, 👨‍🍳 Preparing, ✅ Ready, 🚚 Delivered)
  - Items in each order
  - Bill status if order is delivered
- Changed order type from "QR_CODE" to "DINE_IN" for proper filtering
- Calls `fetchActiveOrders()` after placing an order

**Active Orders Display:**

```javascript
{
  activeOrders.length > 0 && (
    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
      <h3>📦 Your Active Orders</h3>
      {/* Shows real-time order status */}
    </div>
  );
}
```

**Real-Time Polling:**

```javascript
useEffect(() => {
  fetchActiveOrders();
  const orderInterval = setInterval(fetchActiveOrders, 2000);
  return () => clearInterval(orderInterval);
}, [tableId]);
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    REAL-TIME SYNC FLOW                       │
└──────────────────────────────────────────────────────────────┘

FRONTEND (Polling every 2 seconds)
│
├─ DineInManagement
│  ├─ fetch /api/orders?type=DINE_IN
│  ├─ updateTableStatuses()
│  └─ Display tables with live status
│
├─ SimpleMenu (for table #1)
│  ├─ fetch /api/orders?type=DINE_IN
│  ├─ Filter by tableId
│  └─ Display active orders
│
└─ QRCodeOrdering
   └─ Shows CustomerOrderTracker (for order updates)

BACKEND (APIs)
│
├─ /api/orders?type=DINE_IN
│  └─ Returns all dine-in orders with status
│
├─ /api/orders (POST)
│  └─ Creates new order with type: 'DINE_IN'
│
├─ /api/orders/:id (PUT)
│  └─ Updates order status (pending→preparing→ready→delivered)
│
└─ /api/orders/:id/complete-payment (PUT)
   └─ Marks order as paid (bill_status: 'paid')

KITCHEN DISPLAY SYSTEM (KDS)
│
├─ Sees new orders marked as PENDING
├─ Updates status to PREPARING
└─ Updates status to READY

```

---

## Step-by-Step Test Procedure

### Test 1: New Order Creation

```
1. Open DineInManagement page
   ✓ Should see all tables as AVAILABLE (green)

2. Click on Table T1
   ✓ OrderEntryModal opens

3. Select items and place order
   ✓ Table T1 should change to OCCUPIED (red) within 2 seconds
   ✓ Active orders list should show new order

4. Open SimpleMenu (QR/Table menu)
   ✓ Should show "Your Active Orders" section
   ✓ Order should appear with status PENDING
```

### Test 2: Order Status Updates

```
1. In KDS:
   ✓ New pending order appears
   ✓ Click "Mark Preparing"
   ✓ Order status changes to PREPARING

2. Back in DineInManagement:
   ✓ Order shows status: "preparing" in Active Orders
   ✓ Table remains OCCUPIED (red)

3. Back in SimpleMenu:
   ✓ Order status shows: "👨‍🍳 Preparing"
```

### Test 3: Delivery and Billing

```
1. In KDS:
   ✓ Click "Mark Ready for Pickup"
   ✓ Order status changes to READY

2. In DineInManagement:
   ✓ Click "Add Items" on table
   ✓ Confirm delivery

3. In SimpleMenu:
   ✓ Order shows status: "🚚 Delivered"
   ✓ Shows bill status indicator

4. In BillingPage:
   ✓ Delivered orders appear
   ✓ Process payment for order
   ✓ Mark as PAID
```

### Test 4: Table Cleanup

```
1. In DineInManagement:
   ✓ Order delivered and paid
   ✓ Table shows WAITING_PAYMENT (orange)
   ✓ "Mark Available" button appears

2. Click "Mark Available":
   ✓ Table transitions to CLEANING (yellow)
   ✓ Notification: "Table T1 is being cleaned..."
   ✓ After 3 seconds: Table becomes AVAILABLE (green)
   ✓ Order is removed from active orders

3. In SimpleMenu:
   ✓ Active Orders section disappears
   ✓ Can place new order
```

### Test 5: Multiple Tables Sync

```
1. Place order on Table T1
   ✓ T1 shows OCCUPIED

2. Place order on Table T2
   ✓ T2 shows OCCUPIED
   ✓ T1 still shows OCCUPIED

3. Open BillingPage:
   ✓ Both delivered orders show

4. Process payment for T1
   ✓ T1 moves to WAITING_PAYMENT
   ✓ T2 still shows OCCUPIED

5. Mark T1 as available:
   ✓ T1 transitions: CLEANING → AVAILABLE
   ✓ T2 unaffected
```

---

## API Endpoints Used

### Fetch Orders

```javascript
GET /api/orders?type=DINE_IN
// Returns all dine-in orders
```

### Create Order

```javascript
POST /api/orders
{
  table_name: "T1",
  type: "DINE_IN",
  items: [...],
  total: 500
}
```

### Update Order Status

```javascript
PUT /api/orders/:id
{ status: "preparing" | "ready" | "delivered" }
```

### Complete Payment

```javascript
PUT /api/orders/:id/complete-payment
{ payment_method: "cash" | "upi" | "card" }
```

---

## Configuration

### Polling Intervals

- **DineInManagement**: 2 seconds
- **SimpleMenu**: 2 seconds
- **BillingPage**: 3 seconds
- **KitchenDisplaySystem**: 2 seconds

### Table Initial Status

All tables start as **AVAILABLE** (previously hardcoded to "occupied")

### Status Transitions

```
AVAILABLE
  ↓
OCCUPIED (when order placed)
  ↓
WAITING_PAYMENT (when order delivered & paid)
  ↓
CLEANING (transition state)
  ↓
AVAILABLE (after cleanup)
```

---

## Troubleshooting

### Issue: Tables not updating

**Solution:**

1. Check network tab - verify /api/orders requests are being made
2. Ensure backend is running on port 3001
3. Check browser console for errors
4. Force refresh with Ctrl+Shift+R

### Issue: Order not appearing in active orders

**Solution:**

1. Verify order was created with type: "DINE_IN"
2. Check that table_name matches the table ID (T1, T2, etc.)
3. Verify order status is not "completed"

### Issue: Billing status not syncing

**Solution:**

1. Check that bill_status is being set in the database
2. Verify payment completion endpoint is called
3. Check order status is "delivered" before marking as paid

### Issue: Table status stuck

**Solution:**

1. Check if order still has status != "completed"
2. Manually mark order as completed in database
3. Refresh the page

---

## Future Enhancements

1. **WebSocket Integration** - Replace polling with real-time WebSocket updates
2. **Offline Mode** - Cache orders locally if connection is lost
3. **Table Reservations** - Show "Reserved" status for upcoming bookings
4. **Multi-course Orders** - Support multiple ordered courses per table
5. **Split Billing** - Allow splitting bill between multiple customers
6. **Analytics** - Track table utilization and average order time

---

## Summary of Changes

### Files Modified

1. ✅ `frontend/src/components/DineInManagement.jsx`
   - Added real-time polling
   - Added status synchronization
   - Added new status types (WAITING_PAYMENT, CLEANING)

2. ✅ `frontend/src/components/SimpleMenu.jsx`
   - Added active orders display
   - Added real-time polling
   - Changed order type to DINE_IN

3. ✅ `frontend/src/components/BillingPage.jsx`
   - No changes (already synced)

### Key Features Added

- ✅ Real-time table status updates (2-second polling)
- ✅ Automatic status mapping from orders
- ✅ Active orders display in table menu
- ✅ Billing status integration with table availability
- ✅ Proper table cleanup workflow
- ✅ Multi-table synchronization

### Testing Status

- ⏳ Ready for manual testing
- ⏳ All endpoints verified
- ⏳ Real-time polling implemented

---

## Next Steps

1. **Test the implementation** using the test procedures above
2. **Verify real-time updates** across all pages simultaneously
3. **Check billing integration** with table cleanup
4. **Monitor API calls** in browser network tab
5. **Report any issues** with specific test case numbers

Good luck! 🎉
