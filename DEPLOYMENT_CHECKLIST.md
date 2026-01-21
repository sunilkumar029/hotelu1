# ✅ DEPLOYMENT CHECKLIST - Delivery Workflow

## Pre-Deployment Verification

### 1. Database Setup

- [ ] MySQL running on localhost:3306
- [ ] User: root with password: Mysql@7785
- [ ] Run schema update:
  ```bash
  mysql -u root -pMysql@7785 < backend/mrbeast_schema.sql
  ```
- [ ] Verify new Bills table created
- [ ] Verify Orders table updated with new columns
- [ ] Check ENUM status values accepted

### 2. Backend Verification

- [ ] All model files in place:
  - [ ] models/Order.js (updated)
  - [ ] models/Bill.js (new)
  - [ ] models/sequelize.js (no changes)
  - [ ] models/User.js (no changes)
- [ ] server.js contains new endpoints:
  - [ ] /api/orders/:id/confirm-delivery
  - [ ] /api/orders/:id/bill
  - [ ] /api/orders/status/delivered
  - [ ] /api/orders/:id/complete-payment
- [ ] npm dependencies installed: `npm install` in backend

### 3. Frontend Verification

- [ ] All component files in place:
  - [ ] components/WaiterDeliveryPanel.jsx (new)
  - [ ] components/BillingPage.jsx (updated)
  - [ ] components/CustomerOrderTracker.jsx (updated)
  - [ ] components/DineInManagement.jsx (updated)
  - [ ] components/App.jsx (updated)
  - [ ] components/Sidebar.jsx (updated)
- [ ] No TypeScript errors
- [ ] npm dependencies installed: `npm install` in frontend

### 4. Environment Setup

- [ ] Backend port: 3001
- [ ] Frontend port: 3000
- [ ] CORS enabled (backend)
- [ ] JWT secret configured (backend)

---

## Deployment Steps

### Step 1: Database Migration

```bash
# Backup existing database first
mysqldump -u root -pMysql@7785 mrbeast_db > mrbeast_backup_$(date +%s).sql

# Run schema update
mysql -u root -pMysql@7785 mrbeast_db < backend/mrbeast_schema.sql

# Verify
mysql -u root -pMysql@7785 mrbeast_db -e "SHOW TABLES;"
mysql -u root -pMysql@7785 mrbeast_db -e "DESCRIBE bills;"
```

### Step 2: Backend Deployment

```bash
cd backend

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Start server
npm start

# Verify connection
# Should see: "MySQL connection established"
# Should see: "Server is running on port 3001"
```

### Step 3: Frontend Deployment

```bash
cd frontend

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Build (for production)
npm run build

# OR start development server
npm start

# Frontend should be available at http://localhost:3000
```

### Step 4: Test All New Features

- [ ] Login as waiter1 (waiter role)
- [ ] Login as chef1 (chef role)
- [ ] Place order through dine-in
- [ ] Chef marks "preparing"
- [ ] Chef marks "ready"
- [ ] Waiter sees in Delivery tab
- [ ] Waiter confirms delivery
- [ ] Check bill auto-generated
- [ ] Collect payment
- [ ] Verify order marked completed

---

## Post-Deployment Verification

### 1. Database Integrity

```sql
-- Check Orders table structure
DESCRIBE orders;

-- Check Bills table exists
SHOW TABLES;

-- Verify sample order
SELECT * FROM orders WHERE status = 'delivered' LIMIT 1;

-- Verify sample bill
SELECT * FROM bills LIMIT 1;
```

### 2. API Endpoints

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"waiter1","password":"pass"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Test delivered orders endpoint
curl -X GET http://localhost:3001/api/orders/status/delivered \
  -H "Authorization: Bearer $TOKEN"

# Should return array of delivered orders
```

### 3. UI Components

- [ ] WaiterDeliveryPanel renders correctly
- [ ] BillingPage shows delivered orders
- [ ] CustomerOrderTracker shows delivered status
- [ ] Sidebar shows "🚚 Delivery" menu item
- [ ] All buttons clickable and functional

### 4. End-to-End Flow

- [ ] Complete order → ready → delivery → payment → completion
- [ ] Bill auto-generates on delivery
- [ ] Payment recorded correctly
- [ ] Order marked as completed
- [ ] Bill marked as paid

---

## Troubleshooting

### Issue: "Table bills doesn't exist"

```bash
# Solution: Run schema update
mysql -u root -pMysql@7785 < backend/mrbeast_schema.sql
```

### Issue: "Unknown column 'delivered_at'"

```bash
# Solution: Alter orders table
mysql -u root -pMysql@7785 mrbeast_db -e "ALTER TABLE orders ADD COLUMN delivered_at DATETIME NULL;"
```

### Issue: Frontend can't reach backend

- [ ] Check backend is running on 3001
- [ ] Check CORS is enabled
- [ ] Check firewall isn't blocking port 3001
- [ ] Verify API URL in frontend (http://localhost:3001)

### Issue: Bill not generating

- [ ] Check order status is "ready" before delivery
- [ ] Check backend logs for errors
- [ ] Verify Bill model loaded correctly
- [ ] Check database connection

### Issue: "Unauthorized" on API calls

- [ ] Verify JWT token is valid
- [ ] Check token is being sent in Authorization header
- [ ] Verify user role has permission
- [ ] Check JWT_SECRET matches on backend

---

## Rollback Plan (If Needed)

### Database Rollback

```bash
# Restore from backup
mysql -u root -pMysql@7785 mrbeast_db < mrbeast_backup_TIMESTAMP.sql
```

### Code Rollback

```bash
# Restore previous Git version (if using git)
git checkout HEAD~1 -- backend/ frontend/

# OR manually restore from backup
# Replace modified files with originals
```

---

## Performance Monitoring

### Monitor These After Deployment

- [ ] Backend response time (should be < 500ms)
- [ ] Frontend load time (should be < 3 seconds)
- [ ] Database query time (should be < 100ms)
- [ ] Real-time update frequency (3 seconds)

### Check Logs For

- [ ] Database connection errors
- [ ] API endpoint errors
- [ ] Authentication failures
- [ ] Delivery confirmation errors
- [ ] Bill generation errors

---

## Staff Training

### For Chefs

- [ ] No changes - KDS works as before
- [ ] Mark "preparing" when starting order
- [ ] Mark "ready" when order is complete

### For Waiters

- [ ] NEW: Check "🚚 Delivery" tab for ready orders
- [ ] NEW: Click "Confirm Delivery" when delivering
- [ ] Bill auto-generates after delivery
- [ ] Go to "Billing" tab to collect payment

### For Managers

- [ ] Bills now auto-generate on delivery
- [ ] No manual bill entry needed
- [ ] Can see complete order history
- [ ] Monitor delivery confirmation workflow

### For Customers

- [ ] New "🚚 On the Way" status in order tracker
- [ ] Order completes after payment
- [ ] Improved tracking experience

---

## Success Criteria

### ✅ Deployment Successful If:

1. **Database**
   - [ ] Schema updated without errors
   - [ ] Bills table created
   - [ ] Orders table has new columns

2. **Backend**
   - [ ] Server starts on port 3001
   - [ ] MySQL connection successful
   - [ ] All 4 new endpoints accessible

3. **Frontend**
   - [ ] Loads on port 3000
   - [ ] No console errors
   - [ ] All new components render

4. **Functionality**
   - [ ] Orders can be placed
   - [ ] Chef can mark preparing/ready
   - [ ] Waiter can confirm delivery
   - [ ] Bills auto-generate
   - [ ] Payments can be recorded
   - [ ] Orders complete successfully

5. **Data Integrity**
   - [ ] Order data saved correctly
   - [ ] Bill data saved correctly
   - [ ] Relationships maintained (order → bill)
   - [ ] Timestamps recorded

---

## Sign-Off

**Deployed By**: ********\_******** **Date**: ****\_****

**Verified By**: ********\_******** **Date**: ****\_****

**Notes**: ********************************\_********************************

---

---

## Support Contact

For issues during or after deployment:

- Check backend logs: `npm start` output
- Check frontend console: F12 → Console tab
- Check database: `SELECT * FROM orders;`
- Review documentation: DELIVERY_WORKFLOW_COMPLETE.md

**System is production-ready!** 🚀
