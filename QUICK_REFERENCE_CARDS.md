# 🎯 Quick Reference Cards

## Card 1: Permission Management (Admin)

### **Create New Role (5 steps)**

1. Click **"➕ Create New Role / Job Title"**
2. Enter **Role Name** (e.g., "Senior Waiter")
3. Write **Description** (what they do)
4. **Check boxes** for permissions they need
5. Click **"✓ Create Role"**

### **Edit Existing Role**

1. Find role in **"Existing Roles"** section
2. Click the **role card** to expand
3. Click **"✏️ Edit Permissions"**
4. Check/uncheck permissions
5. Click **"✓ Save Changes"**

### **Permission Categories**

| Icon | Category         | What It Controls                |
| ---- | ---------------- | ------------------------------- |
| 👥   | User Management  | Add/remove staff, assign roles  |
| 🍽️   | Menu Management  | Add/edit dishes, set prices     |
| 📋   | Order Management | Create/edit orders, QR ordering |
| 📦   | Inventory        | Check/update stock levels       |
| 💳   | Billing          | Process payments, view bills    |
| 📊   | Dashboard        | View reports, see analytics     |
| ⚙️   | Settings         | System configuration            |

### **Pre-built Role Templates**

```
👑 Admin         → All permissions (24/25)
👔 Manager       → Staff, orders, menu, reports (15+)
🤵 Waiter        → Orders, payments, menu (8)
👨‍🍳 Chef         → Orders, inventory, kitchen display (6)
🏢 Franchise     → Multi-location, reports (12+)
```

---

## Card 2: QR Code Ordering (Complete Flow)

### **For Admin: Generate QR Codes**

1. Go to **Admin → QR Management**
2. Select **number of tables** (1-20)
3. Click **"Generate QR Codes"**
4. Each QR code is **unique per table**
5. Download and **print/display** QR codes at each table

**QR Code URL Format:**

```
http://192.168.1.34:3000?tab=qr-ordering&tableId=1
http://192.168.1.34:3000?tab=qr-ordering&tableId=2
etc.
```

### **For Customers: Order via QR**

1. **Scan QR code** at their table
2. See page: **"QR Code Ordering for [Table Number]"**
3. Browse **full restaurant menu**
4. **Add items to cart**
5. **Place order** (auto-saved to table)
6. **Wait for food**
7. Can **request bill** via button
8. **Pay** (cash or mobile payment)

### **For Kitchen: Receive Orders**

1. See new order in **Kitchen Display System**
2. Order shows: **Order #[ID] - TABLE [Number]**
3. Lists all **items to prepare**
4. Shows **quantities**
5. Mark as **ready when done**

### **For Waiter: Deliver Food**

1. Check **Dine-In Management** section
2. See all **active orders with table numbers**
3. Pick up order from kitchen
4. **Verify table number** on order
5. **Deliver to correct table**
6. Click **"Mark Available"** after delivery
7. Table becomes available for next customer

### **For Customer: Payment & Bill**

1. After order placed, click **"Request Bill"**
2. Choose payment method:
   - **Cash** → Staff will bring payment
   - **PhonePe/UPI** → Scan QR code to pay
   - **Net Banking** → Info shown on page
3. After payment, done!

---

## Card 3: Database Structure (Quick View)

### **orders Table**

```
id                  → Order number
table_name          → Which table (e.g., "1")
status              → pending / preparing / ready / completed
type                → QR_CODE / DINE_IN / TAKEAWAY
total               → Total price
timestamp           → When order placed
bill_requested      → True if customer requested bill
items               → Related order_items records
```

### **order_items Table**

```
id                  → Item ID
orderId             → Which order this belongs to
name                → Dish name (e.g., "Biryani")
quantity            → How many
price               → Price per item
```

### **How table tracking works:**

```
QR Code (tableId=1)
    ↓
Customer Places Order
    ↓
Saved: { table_name: "1", items: [...], status: "pending" }
    ↓
Kitchen sees: "Order #123 - TABLE 1"
    ↓
Waiter delivers to Table 1
    ↓
Waiter clicks "Mark Available"
    ↓
Order marked complete, Table 1 becomes available
```

---

## Card 4: Testing Checklist

### **Quick Test (5 min)**

```
✓ Generate 2 QR codes (Tables 1 & 2)
✓ Scan Table 1 QR → See menu
✓ Add 2x Biryani + 1x Lemonade
✓ Click "Place Order"
✓ Check Dine-In Management
✓ Confirm order shows "Table 1"
✓ Mark available
```

### **Full Test (15 min)**

```
✓ Generate 5 QR codes
✓ Place orders from 3 tables simultaneously
✓ Check Kitchen Display System (shows table numbers)
✓ Check Waiter view (all orders visible with tables)
✓ Mark deliveries complete
✓ Test payment flow
✓ Verify tables return to available
```

### **Verification Points**

```
✓ QR code captures table number
✓ Order saved with table_name field
✓ Waiter sees table number on order
✓ Multiple simultaneous orders work
✓ Payment request links to correct order
✓ Order delivery tracking works
```

---

## Card 5: Common Issues & Fixes

| Issue                                      | Solution                                               |
| ------------------------------------------ | ------------------------------------------------------ |
| **QR doesn't show table number**           | Verify URL has `&tableId=1` parameter                  |
| **Orders don't show table in waiter view** | Check API returns `table_name` field                   |
| **Customer sees "Unknown Table"**          | Verify QR URL generation includes tableId              |
| **Permission not working**                 | Verify user has role, role has permission              |
| **Kitchen can't see orders**               | Check Kitchen Display System component connects to API |
| **Multiple orders mixed up**               | Verify each has unique `table_name`                    |

---

## Card 6: Keyboard Shortcuts (Coming Soon)

```
Admin Section:
Alt + R → Go to Roles management
Alt + P → Go to Permissions view
Alt + Q → Go to QR Management

Waiter Section:
Alt + O → View all orders
Alt + T → View table status
Alt + B → Mark table available
```

---

## Card 7: Mobile View Support

### **Permission Management**

✅ Works on mobile  
✅ Touch-friendly buttons  
✅ Full-width on small screens  
✅ Stacked layout on mobile

### **QR Ordering**

✅ Optimized for phone screens  
✅ Large touch buttons  
✅ Clear menu display  
✅ Simple payment flow

### **Dine-In Management**

✅ Mobile-responsive tables grid  
✅ Order cards stack vertically  
✅ Large order details  
✅ Easy "Mark Available" button

---

## Card 8: Role Permission Matrix

| Role      | View | Create | Edit | Delete | Reports | Settings |
| --------- | ---- | ------ | ---- | ------ | ------- | -------- |
| Admin     | ✅   | ✅     | ✅   | ✅     | ✅      | ✅       |
| Manager   | ✅   | ✅     | ✅   | ✅     | ✅      | ❌       |
| Waiter    | ✅   | ✅     | ✅   | ❌     | ❌      | ❌       |
| Chef      | ✅   | ❌     | ❌   | ❌     | ❌      | ❌       |
| Franchise | ✅   | ❌     | ❌   | ❌     | ✅      | ❌       |

---

## Card 9: API Endpoints Summary

```
👥 Roles & Permissions
POST   /api/roles                          → Create role
GET    /api/roles                          → View all roles
PUT    /api/roles/:id/permissions          → Update role permissions

📋 Orders
GET    /api/orders?type=DINE_IN            → Get dine-in orders
GET    /api/orders?table_name=1            → Get table orders
POST   /api/orders                         → Create order
PUT    /api/orders/:id                     → Update order
PUT    /api/orders/:id/request-bill        → Request bill

🍽️ Menu
GET    /api/menu                           → Get all menu items

🔐 QR
GET    /qr/generate?count=5                → Generate QR codes
```

---

## Card 10: Emergency Contacts

**System Issues:**  
→ Check error messages in console (F12)  
→ Verify backend is running: `npm start` in `/backend`  
→ Check database connection: MySQL running?

**Permission Issues:**  
→ Clear localStorage: Press F12 → Application → Clear Storage  
→ Re-login with admin account  
→ Refresh page (Ctrl+R)

**QR Ordering Issues:**  
→ Test QR code URL manually in browser  
→ Verify table number in URL parameters  
→ Check backend logs for order creation errors

---

**Print or bookmark this page for quick reference! 📌**
