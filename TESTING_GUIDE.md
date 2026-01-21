# 🧪 Quick Testing Guide - Order Flow System

## 🚀 Quick Start

### Open 4 Browser Tabs for Testing

**Tab 1 - Customer (QR Scanner)**

```
http://localhost:3000/?tableId=1
```

**Tab 2 - Staff Login**

```
http://localhost:3000/indexlogin
```

**Tab 3 & 4 - Kitchen Display (Chef/Waiter)**

```
After logging in, click "Kitchen Display" in sidebar
```

---

## 📱 Test Scenario - Complete Order Lifecycle

### **PHASE 1: Customer Places Order** (Tab 1)

1. Open Tab 1: `http://localhost:3000/?tableId=1`
2. You should see: **"🍽️ Our Menu" for Table #1**

3. **Add Items to Cart:**

   - Scroll through categories (Starters, Main Course, Desserts, Beverages, Salads)
   - Click `+ ADD` on "Salads Item 10" (₹300)
   - Click `+ ADD` again to add 2 items (or use +/- in cart)
   - Cart should show: 2x Salads Item 10 = ₹600

4. **Select Payment Method:**

   - Choose one: 💵 Cash, 📱 UPI, or 💳 Card

5. **Place Order:**

   - Click: `✅ Place Order • ₹600`
   - ✅ Should see: `✅ Order #X placed successfully! Total: ₹600`

6. **See Order Tracker:**

   - Status shows: **⏳ PENDING**
   - Progress bar at 25%
   - Items list visible
   - Total: ₹600
   - Message: "Your order has been received and sent to the kitchen"

7. **Watch Auto-Refresh:**
   - Tracker updates every 2 seconds automatically
   - No manual refresh needed

---

### **PHASE 2: Chef Sees & Prepares Order** (Tab 2 → Tab 3)

1. Open Tab 2: `http://localhost:3000/indexlogin`

2. **Login as Chef:**

   - Username: `chef1`
   - Password: `pass`
   - Click: "Staff Login"
   - ✅ Should redirect to admin dashboard

3. Open Tab 3: **Click "Kitchen Display" in sidebar**

   - 🔴 You see: **"NEW ORDERS"** section with Order #X
   - Shows: "2x Salads Item 10"
   - Status badge: ⏳ PENDING

4. **Chef Marks Order as Preparing:**

   - Click red button: `👨‍🍳 Mark Preparing`
   - ✅ Notification: "✅ Order #X → PREPARING"
   - Order moves from 🔴 RED section to 🟡 YELLOW section
   - Status badge: 👨‍🍳 PREPARING

5. **Watch Customer Tab Update:** (Check Tab 1)
   - ✅ Status changed: **👨‍🍳 PREPARING**
   - Progress bar fills to 60%
   - Message: "Chef is making your food"

---

### **PHASE 3: Chef Marks Order Ready** (Tab 3)

1. In Tab 3 (KDS): In 🟡 **"PREPARING"** section

   - Click green button: `✅ Mark Ready for Pickup`
   - ✅ Notification: "✅ Order #X → READY"
   - Order moves from 🟡 YELLOW to 🟢 GREEN section

2. **Watch Customer Tab Update:** (Check Tab 1)
   - ✅ Status changed: **✅ READY**
   - Progress bar fills to 90%
   - **🎉 BIG CELEBRATION with emoji**
   - Message: "Your order is ready! Please call the waiter to collect."

---

### **PHASE 4: Waiter Takes & Delivers Order** (Tab 4)

1. Open Tab 4: `http://localhost:3000/indexlogin`

2. **Login as Waiter:**

   - Username: `waiter1`
   - Password: `pass`
   - Click: "Staff Login"

3. **Click "Kitchen Display"**

   - 🟢 **"READY FOR PICKUP"** section shows Order #X
   - "2x Salads Item 10" ready to deliver

4. **Waiter Marks Order Delivered:**

   - Click blue button: `🎉 Mark Delivered`
   - ✅ Notification: "✅ Order #X → COMPLETED"
   - Order disappears from KDS

5. **Watch Customer Tab Update:** (Check Tab 1)
   - ✅ Status changed: **🎉 COMPLETED**
   - Message: "We hope you enjoyed your meal. Thank you!"
   - Order no longer visible on tracker

---

## ✅ What to Verify at Each Stage

### Customer Tab (Tab 1)

- [ ] Initial state shows menu with large buttons
- [ ] "Salads Item 10" is visible with price ₹300
- [ ] "+ ADD" button is prominent and clickable
- [ ] Cart shows items with +/- quantity controls
- [ ] Total amount updates correctly
- [ ] Payment method buttons are visible
- [ ] "✅ Place Order" button is large and centered
- [ ] After order: Tracker appears
- [ ] Order status auto-updates without refresh
- [ ] Progress bar progresses: 25% → 60% → 90%
- [ ] Messages guide customer appropriately
- [ ] Celebration appears when ready
- [ ] "+ Place Another Order" button works

### Chef Tab (Tab 3)

- [ ] 3 color-coded columns visible: 🔴 🟡 🟢
- [ ] New order appears in RED column
- [ ] Table number is large and clear
- [ ] Items listed with prices
- [ ] Time elapsed shown (should be ~0-5 seconds old)
- [ ] "👨‍🍳 Mark Preparing" button visible and clickable
- [ ] Order moves to YELLOW after "Mark Preparing"
- [ ] "✅ Mark Ready for Pickup" button visible in YELLOW
- [ ] Order moves to GREEN after "Mark Ready"
- [ ] Auto-refresh works (you see updates without refresh)

### Waiter Tab (Tab 4)

- [ ] Can login as waiter1
- [ ] Kitchen Display is accessible (NOT blocked)
- [ ] Can see ready orders in GREEN column
- [ ] "🎉 Mark Delivered" button visible
- [ ] Order disappears after marking delivered

---

## 🐛 Troubleshooting

### Issue: Customer tracker not updating

**Solution:** Check browser console for errors. Verify backend running on port 3001.

```bash
# Check backend
curl http://localhost:3001/api/orders
```

### Issue: Order not appearing in KDS

**Solution:** KDS auto-refreshes every 3 seconds. Wait up to 3 seconds.
Click the refresh toggle to ensure auto-refresh is ON.

### Issue: Waiter can't access KDS

**Solution:** This means App.jsx wasn't updated. Check line 255:

```javascript
// Should include 'waiter' in the role check
case 'kds':
  return (role === 'admin' || role === 'subfranchise' || role === 'chef' || role === 'manager' || role === 'waiter')
    ? <KitchenDisplaySystem />
    : <NoAccessMessage />;
```

### Issue: SimpleMenu not loading

**Solution:** Ensure backend serving `/api/menu`. Check:

```bash
curl http://localhost:3001/api/menu
```

### Issue: Order placement fails (401 Unauthorized)

**Solution:** This should NOT happen. Backend has optionalToken middleware.
Check that backend has:

```javascript
const optionalToken = (req, res, next) => { ... }
app.post("/api/orders", optionalToken, ...)
```

---

## 📊 Test Results Template

Use this to document your testing:

```
Date: ________________
Tested By: ________________

CUSTOMER FLOW (Tab 1):
[ ] Menu loads correctly ✓ / ✗
[ ] Items visible with prices ✓ / ✗
[ ] Can add items to cart ✓ / ✗
[ ] Cart calculations correct ✓ / ✗
[ ] Payment methods visible ✓ / ✗
[ ] Order places successfully ✓ / ✗
[ ] Tracker appears and loads ✓ / ✗
[ ] Auto-refresh every 2 seconds ✓ / ✗
[ ] Status updates visible ✓ / ✗

CHEF FLOW (Tab 3):
[ ] KDS loads with 3 columns ✓ / ✗
[ ] New order in RED column ✓ / ✗
[ ] Can mark "Preparing" ✓ / ✗
[ ] Order moves to YELLOW ✓ / ✗
[ ] Can mark "Ready" ✓ / ✗
[ ] Order moves to GREEN ✓ / ✗
[ ] Auto-refresh works ✓ / ✗

WAITER FLOW (Tab 4):
[ ] Can login as waiter ✓ / ✗
[ ] KDS accessible (not blocked) ✓ / ✗
[ ] Can see READY orders in GREEN ✓ / ✗
[ ] Can mark "Delivered" ✓ / ✗
[ ] Order disappears from KDS ✓ / ✗

CUSTOMER UPDATE CHECK (Back to Tab 1):
[ ] Status changed to PREPARING ✓ / ✗
[ ] Status changed to READY ✓ / ✗
[ ] Celebration message shown ✓ / ✗
[ ] Status changed to COMPLETED ✓ / ✗

ISSUES FOUND:
_________________________________________
_________________________________________

NOTES:
_________________________________________
_________________________________________
```

---

## 🎯 Expected Outcomes

✅ **Customer sees:** Menu → Order → Tracker with real-time updates → Completion celebration

✅ **Chef sees:** New order → Marks preparing → Marks ready

✅ **Waiter sees:** Ready orders → Delivers → Order closed

✅ **All updates happen automatically** via auto-refresh (no manual refresh needed)

✅ **Simple, layman-friendly UI** with large buttons and clear guidance

---

## 📞 Support

If any step fails, check:

1. Both servers running (`http://localhost:3000` and `http://localhost:3001`)
2. Browser console for JavaScript errors
3. Network tab for API calls
4. Database has orders table with items

**All tests should pass! 🎉**
