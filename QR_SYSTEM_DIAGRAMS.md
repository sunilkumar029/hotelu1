# 📊 QR Code Ordering System - Visual Diagrams

## Diagram 1: System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     RESTAURANT QR ORDERING SYSTEM                │
└─────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │  ADMIN SECTION  │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
           ┌────────▼────────┐        ┌─────────▼──────────┐
           │ QR MANAGEMENT   │        │ PERMISSION & ROLES │
           │                 │        │                    │
           │ • Generate QR   │        │ • Create Roles     │
           │ • Per Table     │        │ • Manage Access    │
           │ • Download/    │        │                    │
           │   Print         │        └────────────────────┘
           └────────┬────────┘
                    │
          ┌─────────▼─────────┐
          │  DATABASE: MySQL  │
          │                   │
          │ • orders table    │
          │ • order_items     │
          │ • users, roles    │
          └───────────────────┘
                    ▲
          ┌─────────┴────────────────────────────────────┐
          │                                              │
     ┌────▼─────────────┐  ┌──────────────────┐  ┌──────▼──────┐
     │  KITCHEN VIEW    │  │  WAITER VIEW     │  │ CUSTOMER QR │
     │                  │  │                  │  │    ORDERING │
     │ • See orders     │  │ • View all       │  │             │
     │ • Table number   │  │   active orders  │  │ • Scan QR   │
     │ • Mark ready     │  │ • Table numbers  │  │ • View menu │
     │                  │  │ • Mark available │  │ • Order     │
     └──────────────────┘  └──────────────────┘  │ • Pay       │
                                                  └─────────────┘
```

---

## Diagram 2: Order Creation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              QR CODE ORDERING FLOW - STEP BY STEP            │
└─────────────────────────────────────────────────────────────┘

STEP 1: Admin Creates QR Codes
┌──────────────────────────────────────────┐
│ Admin: "Generate 5 QR Codes"             │
│                                          │
│ [QR-001] → tableId=1                    │
│ [QR-002] → tableId=2                    │
│ [QR-003] → tableId=3                    │
│ [QR-004] → tableId=4                    │
│ [QR-005] → tableId=5                    │
│                                          │
│ Each QR stored at physical table         │
└────────────┬───────────────────────────┘
             │
             ▼
STEP 2: Customer Scans QR
┌──────────────────────────────────────────┐
│ 📱 Customer at Table 3 scans QR          │
│                                          │
│ URL loaded:                              │
│ http://app.com?tab=qr-ordering&tableId=3│
│                                          │
│ App detects: tableId = "3"               │
└────────────┬───────────────────────────┘
             │
             ▼
STEP 3: Menu Display
┌──────────────────────────────────────────┐
│ 🍽️  QR Code Ordering for 3               │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Biryani              ₹180           │ │
│ │ [Add to Cart]                       │ │
│ │ Lemonade             ₹90            │ │
│ │ [Add to Cart]                       │ │
│ │ Butter Naan          ₹60            │ │
│ │ [Add to Cart]                       │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ 🛒 Cart: 2x Biryani, 1x Lemonade        │
└────────────┬───────────────────────────┘
             │
             ▼
STEP 4: Place Order
┌──────────────────────────────────────────┐
│ Customer: Clicks "Place Order"           │
│                                          │
│ Order Data:                              │
│ {                                        │
│   table_name: "3",          ← CRITICAL  │
│   items: [                              │
│     { name: "Biryani", qty: 2 },        │
│     { name: "Lemonade", qty: 1 }        │
│   ],                                     │
│   total: 450.00,                        │
│   type: "QR_CODE",                      │
│   status: "pending"                     │
│ }                                        │
└────────────┬───────────────────────────┘
             │ HTTP POST to /api/orders
             ▼
STEP 5: Order Saved to Database
┌──────────────────────────────────────────┐
│ MySQL: orders table                      │
│                                          │
│ INSERT INTO orders VALUES:               │
│ id              | 123                    │
│ table_name      | 3          ← STORED   │
│ status          | pending                │
│ total           | 450.00                 │
│ type            | QR_CODE                │
│ timestamp       | 2024-01-15 10:30:00   │
│ bill_requested  | false                  │
│                                          │
│ ORDER_ITEMS:                             │
│ id | orderId | name     | qty | price   │
│ 1  | 123     | Biryani  | 2   | 180     │
│ 2  | 123     | Lemonade | 1   | 90      │
└────────────┬───────────────────────────┘
             │
      ┌──────┴─────────┬──────────────┐
      │                │              │
      ▼                ▼              ▼
   KITCHEN         WAITER         CUSTOMER
   (Order #123)    (Tracking)     (App Update)
```

---

## Diagram 3: Simultaneous Orders from Multiple Tables

```
Time: 10:30:00
┌──────────────────────────────────────────────────────────────┐
│ MULTIPLE CUSTOMERS ORDERING AT SAME TIME                     │
└──────────────────────────────────────────────────────────────┘

Customer at Table 1:          Customer at Table 3:
Scans QR-001                  Scans QR-003
tableId = "1"                 tableId = "3"
Orders: 2x Biryani            Orders: 1x Paneer, 1x Rice
Placed at 10:30:00            Placed at 10:30:02

                    ↓                         ↓

            ┌───────────────────────────┐
            │   ORDERS DATABASE         │
            ├───────────────────────────┤
            │ Order #121 - Table 1      │
            │ • 2x Biryani              │
            │ • Status: pending         │
            │ • Time: 10:30:00          │
            │                           │
            │ Order #122 - Table 3      │
            │ • 1x Paneer               │
            │ • 1x Rice                 │
            │ • Status: pending         │
            │ • Time: 10:30:02          │
            └───────────────────────────┘

                    ↓

KITCHEN DISPLAY SYSTEM shows:

┌─────────────────┐  ┌─────────────────┐
│ Order #121      │  │ Order #122      │
│ TABLE 1         │  │ TABLE 3         │
│                 │  │                 │
│ 2x Biryani ▢   │  │ 1x Paneer ▢    │
│              │  │ 1x Rice ▢     │
│ [Ready]         │  │                 │
│                 │  │ [Ready]         │
└─────────────────┘  └─────────────────┘

                    ↓

WAITER MANAGEMENT shows:

┌────────────────────────────────────────┐
│ ACTIVE DINE-IN ORDERS                  │
├────────────────────────────────────────┤
│ Order #121 - Table 1                   │
│ 2x Biryani | ₹360 | [Mark Available]  │
│                                        │
│ Order #122 - Table 3                   │
│ 1x Paneer, 1x Rice | ₹420 | [Mark Av.]│
└────────────────────────────────────────┘

Waiter delivers:
- Food to Table 1 for Order #121
- Food to Table 3 for Order #122
- Each table number clearly marked on order ticket
```

---

## Diagram 4: Order Lifecycle

```
┌───────────────────────────────────────────────────────────────┐
│                    ORDER LIFECYCLE                             │
└───────────────────────────────────────────────────────────────┘

START: Customer Places Order via QR
       ↓
    [PENDING] ← Order saved to database with tableId
       ↓
    KITCHEN receives order
    • Sees: "Order #123 - TABLE 1"
    • Prepares items
       ↓
    [PREPARING] ← Kitchen marks items as "in progress"
       ↓
    Kitchen marks items [Ready]
       ↓
    [READY] ← Food ready in kitchen
       ↓
    WAITER picks up order
    • Sees table number: "Table 1"
    • Verifies items match order
    • Delivers to correct table
       ↓
    [DELIVERED] ← Waiter marks "In Progress"
       ↓
    CUSTOMER eating...
       ↓
    CUSTOMER requests bill
    • Clicks "Request Bill" on QR page
    • Waiter brings payment terminal
       ↓
    [PAYMENT_PENDING] ← Waiting for payment
       ↓
    Payment processed
    • Cash / UPI / Card
    • Amount confirmed
       ↓
    [COMPLETED] ← Order marked done
       ↓
    TABLE BECOMES AVAILABLE
    • Marked as available for next customer
    • Waiter clears table
       ↓
END: Order fully completed
    Table ready for next customer
```

---

## Diagram 5: Table Status & Order Mapping

```
RESTAURANT LAYOUT
┌─────────────────────────────────────────────────────────┐
│  🍽️ Dining Area                                         │
│                                                         │
│  ┌──────────┐              ┌──────────┐               │
│  │ Table 1  │              │ Table 2  │               │
│  │ OCCUPIED │              │ AVAILABLE│               │
│  │ Order:123│              │ No Order │               │
│  └──────────┘              └──────────┘               │
│                                                         │
│  ┌──────────┐              ┌──────────┐               │
│  │ Table 3  │              │ Table 4  │               │
│  │ OCCUPIED │              │ AVAILABLE│               │
│  │ Order:124│              │ No Order │               │
│  └──────────┘              └──────────┘               │
│                                                         │
│  ┌──────────┐                                          │
│  │ Table 5  │                                          │
│  │ AVAILABLE│                                          │
│  │ No Order │                                          │
│  └──────────┘                                          │
│                                                         │
└─────────────────────────────────────────────────────────┘

DATA MAPPING in DATABASE

┌──────────────────────────────┐
│ TABLES                       │
├──────────────────────────────┤
│ Table 1: OCCUPIED            │
│ ↓ order_id: 123              │
│ ├─ 2x Biryani                │
│ ├─ 1x Lemonade               │
│ └─ Status: pending           │
│                              │
│ Table 2: AVAILABLE           │
│ ↓ order_id: null             │
│                              │
│ Table 3: OCCUPIED            │
│ ↓ order_id: 124              │
│ ├─ 1x Paneer                 │
│ ├─ 2x Rice                   │
│ └─ Status: ready             │
│                              │
│ Table 4: AVAILABLE           │
│ ↓ order_id: null             │
│                              │
│ Table 5: AVAILABLE           │
│ ↓ order_id: null             │
└──────────────────────────────┘

WAITER VIEW:
┌────────────────────────────────────────┐
│ ACTIVE ORDERS (3 tables occupied)      │
├────────────────────────────────────────┤
│ ① Order #123 - Table 1 - PENDING      │
│    2x Biryani, 1x Lemonade            │
│    [Deliver] [Add Items] [Cancel]     │
│                                        │
│ ② Order #124 - Table 3 - READY       │
│    1x Paneer, 2x Rice                 │
│    [Deliver] [Add Items] [Cancel]     │
│                                        │
│ AVAILABLE TABLES (2 tables)            │
│ • Table 2                              │
│ • Table 4                              │
│ • Table 5                              │
└────────────────────────────────────────┘
```

---

## Diagram 6: Payment Flow

```
CUSTOMER ON QR PAGE (Has Placed Order)
            │
            ├─ Order #123 - Table 3
            ├─ 2x Biryani, 1x Lemonade
            ├─ Total: ₹450.00
            │
            └─ [Request Bill] ← Customer clicks
                    │
                    ▼
            PAYMENT OPTIONS APPEAR
            ┌──────────────────────────┐
            │ How would you like to pay?│
            │                          │
            │ 💵 Cash                  │
            │ 📱 PhonePe / UPI        │
            │ 🏦 Net Banking          │
            └──────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    CASH         UPI/PHONEPE  NET BANKING
        │           │           │
        │           │           └─ Show bank info
        │           │
        │           └─ Enter amount → [Pay]
        │               Opens UPI app
        │
        └─ Waiter brings POS
            Customer swipes card
            / hands cash
                    │
                    ▼
            PAYMENT RECEIVED
            ✓ Amount matched
            ✓ Receipt generated
                    │
                    ▼
            ORDER MARKED COMPLETED
            ✓ Status: completed
            ✓ Bill: paid
            ✓ Table marked available
```

---

## Diagram 7: Backend API Calls

```
┌─────────────────────────────────────────────────────────────┐
│           API ENDPOINTS FOR QR ORDERING SYSTEM               │
└─────────────────────────────────────────────────────────────┘

1. QR CODE GENERATION
   Endpoint: GET /qr/generate?count=5
   Response: QR codes with tableId parameters
   Used by: Admin QR Management

2. GET MENU
   Endpoint: GET /api/menu
   Response: [{ id, name, category, price }, ...]
   Used by: Customer QR page

3. CREATE ORDER
   Endpoint: POST /api/orders
   Body: {
     table_name: "1",      ← CRITICAL
     items: [
       { productId, name, quantity, price }
     ],
     total: 450.00,
     status: "pending",
     type: "QR_CODE"
   }
   Response: { id: 123, table_name: "1", ... }
   Used by: Customer placing order

4. GET ORDERS BY TABLE
   Endpoint: GET /api/orders?table_name=1
   Response: [{ id, table_name, items, status, ... }]
   Used by: Customer QR page (to show existing orders)

5. GET DINE-IN ORDERS
   Endpoint: GET /api/orders?type=DINE_IN
   Response: [{ id, table_name, items, status, ... }]
   Used by: Waiter management, Kitchen display

6. UPDATE ORDER STATUS
   Endpoint: PUT /api/orders/{id}
   Body: { status: "completed" }
   Used by: Waiter marking delivery complete

7. REQUEST BILL
   Endpoint: PUT /api/orders/{id}/request-bill
   Response: { id, bill_requested: true }
   Used by: Customer requesting bill

FLOW:
┌─────────┐
│ CUSTOMER│
│ QR Page │
└────┬────┘
     │ GET /api/menu
     │ ↓ (Show menu items)
     │
     │ POST /api/orders (Place order)
     │ Body: { table_name: "1", items: [...] }
     │ ↓ (Order saved with table)
     │
     │ GET /api/orders?table_name=1
     │ ↓ (Show existing orders)
     │
     │ PUT /api/orders/{id}/request-bill
     │ ↓ (Request bill)
     │
     └─▶ DATABASE (MySQL)
         Order #123: table_name="1", items=[...], status="pending"

┌─────────────┐
│ KITCHEN/    │
│ WAITER      │
└────┬────────┘
     │ GET /api/orders?type=DINE_IN
     │ ↓ (Get all active orders with tables)
     │
     │ PUT /api/orders/{id}
     │ Body: { status: "completed" }
     │ ↓ (Mark order done)
     │
     └─▶ DATABASE (MySQL)
         Updates order status, marks table available
```

---

## Diagram 8: Error Recovery

```
SCENARIO: Customer scans QR but table number isn't received

Customer scans QR
       ↓
App tries to read tableId from URL
       │
       ├─ SUCCESS: tableId found
       │  └─ Shows "QR Code Ordering for [TableNumber]"
       │     (Proceeds normally)
       │
       └─ FAILURE: tableId NOT found
          └─ Shows "QR Code Ordering for Unknown Table"
             ├─ Still shows menu
             ├─ Still allows ordering
             ├─ Order saved with table_name: "Unknown Table"
             │
             └─ RECOVERY OPTIONS:
                ├─ Manually type table number
                ├─ Ask waiter for table number
                └─ Rescan QR code (clear cache first)

SCENARIO: Order doesn't appear in waiter view

Waiter doesn't see order
       ↓
CHECK:
├─ Is order in database? (Check MySQL)
├─ Was table_name saved? (Check order.table_name)
├─ Is order status "pending"? (Not completed/cancelled)
├─ Backend running? (Check npm start output)
└─ API working? (Test GET /api/orders)

FIX:
├─ Refresh browser (Ctrl+R)
├─ Check network in F12 console
├─ Verify backend error logs
└─ Contact admin if issue persists

SCENARIO: Payment doesn't process

Customer clicks "Request Bill"
       ↓
No payment options appear
       │
CHECK:
├─ Customer connected to internet?
├─ Payment modal loading?
├─ Backend /api/orders endpoint working?
└─ Order exists in database?

FIX:
├─ Refresh page
├─ Check internet connection
├─ Manually inform waiter of payment
├─ Waiter processes manually
└─ Admin marks order as paid
```

---

## Diagram 9: Data Security

```
DATA FLOW & SECURITY

CUSTOMER
  └─ Scans QR
     └─ Browser receives tableId (from URL)
        └─ SECURE: URL parameter (no sensitive data)

APP
  └─ Stores tableId in component state
     └─ SECURE: Only in memory, not persisted locally

ORDER CREATION
  └─ Sends: { table_name: "1", items: [...], total: 450.00 }
     └─ SECURE: HTTPS encryption (recommended)
     └─ Includes: Product IDs, quantities, prices (safe)
     └─ NO PASSWORD/AUTH required (QR is public)

DATABASE
  └─ orders table
     ├─ table_name: "1" → SECURE: Public info
     ├─ items: [...] → SECURE: Menu data (public)
     ├─ total: 450.00 → SECURE: Price calculation
     └─ status: "pending" → SECURE: Order state

API ACCESS
  ├─ GET /api/orders → Anyone can query
  │  └─ Returns: order data (public dine-in view)
  │
  ├─ POST /api/orders → Anyone can submit
  │  └─ CAUTION: Rate limiting should be enabled
  │
  └─ PUT /api/orders/{id} → Anyone can update
     └─ RECOMMENDED: Add order-specific token/key

PAYMENT
  └─ PhonePe/UPI → Handled by 3rd party
     └─ SECURE: Uses official payment gateway
     └─ NO card data stored locally

RECOMMENDATIONS:
✓ Enable HTTPS
✓ Add rate limiting to /api/orders POST
✓ Validate table_name format (no injection)
✓ Sanitize user input
✓ Use environment variables for API keys
✓ Log all order transactions
```

---

**These diagrams help visualize how the QR ordering system works from multiple perspectives! 📊**
