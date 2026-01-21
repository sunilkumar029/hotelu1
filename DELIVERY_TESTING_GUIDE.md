# 🧪 QUICK TEST GUIDE - Order Delivery Workflow

## Quick Start Testing (5 minutes)

### Prerequisites

- MySQL running on localhost:3306
- Database created: `mrbeast_db`
- Backend running: `npm start` in backend folder

---

## Test Scenario: Complete Order from Start to Finish

### Phase 1: Place an Order (1 min)

**Option A: Using Frontend (Dine-In)**

1. Open frontend on `http://localhost:3000`
2. Login as `waiter1` / `pass`
3. Go to "🍽️ Dine-In" tab
4. Click on Table T1
5. Add items: 2x Burger (₹150 each), 1x Fries (₹80)
6. Submit order

**Option B: Using API (cURL)**

```bash
# 1. Get token
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"waiter1","password":"pass"}'

# Save the token from response

# 2. Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "table_name": "T1",
    "items": [
      {"name": "Burger", "quantity": 2, "price": 150},
      {"name": "Fries", "quantity": 1, "price": 80}
    ],
    "total": 380,
    "type": "DINE_IN",
    "status": "pending"
  }'
```

---

### Phase 2: Chef Marks Ready (1 min)

**In Frontend**:

1. Login as `chef1` / `pass` (new browser tab)
2. Go to "Kitchen Display" tab
3. See your Table T1 order
4. Click "👨‍🍳 Mark Preparing"
5. Wait 3 seconds (auto-refresh)
6. Click "✅ Mark Ready for Pickup"

**In API**:

```bash
curl -X PUT http://localhost:3001/api/orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status": "ready"}'
```

---

### Phase 3: Waiter Confirms Delivery (1 min)

**In Frontend**:

1. Back to waiter1 browser tab
2. Go to "🚚 Delivery" tab (NEW!)
3. See Table T1 order marked as ready
4. Review items and total
5. Click "🚚 Confirm Delivery & Close Order"
6. Success message appears ✅

**What happens automatically**:

- ✅ Order status → "delivered"
- ✅ Bill auto-generated
- ✅ Subtotal: ₹380
- ✅ Tax (5%): ₹19
- ✅ Total: ₹399

**In API**:

```bash
curl -X PUT http://localhost:3001/api/orders/1/confirm-delivery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"tax_rate": 0.05}'

# Response includes:
# - Updated order with status: "delivered"
# - Auto-generated bill
```

---

### Phase 4: Bill and Collect Payment (2 min)

**In Frontend**:

1. Go to "Billing" tab
2. Order #1 now appears in "Delivered Orders" section
3. Click on it to select
4. Bill details automatically load
5. Select payment method: "Cash"
6. Click "✅ Complete Payment & Close Order"
7. Bill prints automatically

**In API**:

```bash
curl -X PUT http://localhost:3001/api/orders/1/complete-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"payment_method": "cash"}'

# Response:
# - Order status: "completed"
# - Bill status: "paid"
# - Payment method recorded
```

---

### Phase 5: Verify in Customer View (Optional)

**In Frontend**:

1. Open QR ordering page: `http://localhost:3000/?tableId=T1`
2. Open your order tracker (if order was placed via QR)
3. Watch status progression:
   - ⏳ Pending (0-20%)
   - 👨‍🍳 Preparing (20-45%)
   - ✅ Ready (45-75%)
   - 🚚 Delivered (75-95%)
   - 🎉 Completed (100%)

---

## Database Verification

### Check Order Status

```sql
mysql -u root -pMysql@7785 mrbeast_db

SELECT id, table_name, status, delivered_at, bill_generated, payment_method
FROM orders
WHERE id = 1;

# Expected output:
# | id | table_name | status    | delivered_at         | bill_generated | payment_method |
# | 1  | T1         | completed | 2026-01-19 10:30:00 | 1              | cash           |
```

### Check Bill

```sql
SELECT id, orderId, subtotal, tax, total, bill_status, paid_at
FROM bills
WHERE orderId = 1;

# Expected output:
# | id | orderId | subtotal | tax  | total | bill_status | paid_at          |
# | 1  | 1       | 380      | 19   | 399   | paid        | 2026-01-19 10:32 |
```

---

## Testing Different Scenarios

### Scenario 1: Multiple Tables

1. Repeat order placement for Tables T2, T3
2. Chef sees all 3 orders in KDS
3. Mark them ready one by one
4. Waiter delivery panel shows all 3
5. Confirm deliveries one by one
6. Billing shows all 3 delivered orders

### Scenario 2: Different Payment Methods

1. Place 3 orders
2. Confirm 3 deliveries
3. On billing, select:
   - Order 1: Cash
   - Order 2: Card
   - Order 3: UPI
4. Verify payment_method recorded for each

### Scenario 3: Cancel Delivery (Reject)

```bash
# If waiter needs to cancel (order not ready):
curl -X PUT http://localhost:3001/api/orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status": "preparing"}'
# Changes back to "preparing"
```

---

## Troubleshooting

### "Order not found" error

- ✅ Make sure order exists: `SELECT * FROM orders;`
- ✅ Check order ID is correct

### "Bill not found" error

- ✅ Make sure delivery was confirmed first
- ✅ Delivery confirmation auto-creates bill
- ✅ Check: `SELECT * FROM bills WHERE orderId = 1;`

### "Unauthorized" error

- ✅ Make sure token is valid
- ✅ Token expires in 24 hours
- ✅ Re-login if needed

### Orders not showing in delivery panel

- ✅ Make sure order status is "ready" (chef marked it)
- ✅ Delivery panel filters: `status = 'ready'`
- ✅ Check: `SELECT * FROM orders WHERE status = 'ready';`

---

## Performance Notes

- ✅ Queries optimized with indexes
- ✅ Frontend auto-refresh: 3 seconds (configurable)
- ✅ Real-time updates via polling
- ✅ Database connections pooled
- ✅ No N+1 queries (using includes in Sequelize)

---

## Success Indicators ✅

Your implementation is working if you see:

1. ✅ Order placed successfully
2. ✅ Chef sees order in KDS
3. ✅ Order status changes to "preparing"
4. ✅ Order status changes to "ready"
5. ✅ Delivery panel shows ready orders
6. ✅ Waiter confirms delivery
7. ✅ Order status changes to "delivered"
8. ✅ Bill automatically appears in database
9. ✅ Billing page shows delivered order
10. ✅ Payment recorded successfully
11. ✅ Order status changes to "completed"
12. ✅ Bill marked as "paid"

**If all 12 checks pass, you're all set! 🎉**

---

## Expected Timings

| Step                       | Expected Time          |
| -------------------------- | ---------------------- |
| Order placement            | < 1 sec                |
| Chef sees in KDS           | < 3 sec (auto-refresh) |
| Status update to preparing | < 2 sec                |
| Status update to ready     | < 2 sec                |
| Delivery confirmation      | < 1 sec                |
| Bill auto-generation       | < 1 sec                |
| Payment completion         | < 2 sec                |
| **Total end-to-end**       | **~5-10 seconds**      |

---

## Next Steps

After successful testing:

1. **Load Testing**: Test with 10+ concurrent orders
2. **Stress Testing**: Rapid order placement and delivery
3. **User Acceptance**: Have actual staff test
4. **Data Export**: Export order/bill history
5. **Deployment**: Move to production environment

**Happy Testing! 🚀**
