# API Testing Guide - Direct API Calls

## Current Issues Found

1. **Mock Data Fallback**: Application falls back to mock data when DB is not connected
2. **Database Connection**: Check if MySQL is running on localhost with the configured credentials
3. **JWT Required**: Protected endpoints require Bearer token from login
4. **Test API Script**: Old test-api.js doesn't include JWT authentication

## Database Configuration

**File**: `backend/models/sequelize.js`

```
Host: localhost
Database: mrbeast_db
User: root
Password: Mysql@7785
Dialect: MySQL
```

**Note**: Make sure MySQL server is running and database exists!

---

## Complete API Testing Flow

### 1. LOGIN - Get JWT Token

```
POST http://localhost:3001/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin",
    "name": "Admin User"
  }
}
```

**Save the token for all protected endpoint calls!**

---

## PUBLIC ENDPOINTS (No Auth Required)

### 2. GET All Menu Items

```
GET http://localhost:3001/api/menu
Content-Type: application/json
```

### 3. GET Orders (with filters)

```
GET http://localhost:3001/api/orders
GET http://localhost:3001/api/orders?type=DINE_IN
GET http://localhost:3001/api/orders?type=TAKEAWAY
GET http://localhost:3001/api/orders?status=pending
GET http://localhost:3001/api/orders?table_name=T1
```

### 4. GET Inventory

```
GET http://localhost:3001/api/inventory
```

---

## PROTECTED ENDPOINTS (Requires JWT Token)

### Authentication Header Required for All Below:

```
Authorization: Bearer {YOUR_JWT_TOKEN}
Content-Type: application/json
```

### 5. GET All Users (Admin Only)

```
GET http://localhost:3001/api/users

Response:
[
  {
    "username": "admin",
    "role": "admin",
    "name": "Admin User"
  },
  {
    "username": "chef1",
    "role": "chef",
    "name": "Chef"
  }
]
```

### 6. CREATE New User (Admin Only)

```
POST http://localhost:3001/api/users

{
  "username": "newchef2",
  "password": "pass123",
  "name": "New Chef",
  "role": "chef"
}

Valid Roles: admin, franchise, subfranchise, manager, waiter, chef

Response:
{
  "message": "User created successfully",
  "user": {
    "username": "newchef2",
    "role": "chef",
    "name": "New Chef"
  }
}
```

### 7. CREATE Menu Item (Admin/Manager/SubFranchise)

```
POST http://localhost:3001/api/menu

{
  "name": "Grilled Chicken",
  "price": 24.99,
  "category": "Main Course",
  "description": "Juicy grilled chicken with herbs"
}
```

### 8. UPDATE Menu Item

```
PUT http://localhost:3001/api/menu/1

{
  "name": "Grilled Chicken Updated",
  "price": 26.99,
  "category": "Main Course",
  "description": "Updated description"
}
```

### 9. DELETE Menu Item

```
DELETE http://localhost:3001/api/menu/1
```

### 10. CREATE Order (Waiter/Manager/Admin)

```
POST http://localhost:3001/api/orders

{
  "table_name": "T5",
  "type": "DINE_IN",
  "status": "pending",
  "total": 45.99,
  "items": [
    {
      "name": "Burger",
      "quantity": 2,
      "price": 19.99,
      "menuItemId": 1
    },
    {
      "name": "Fries",
      "quantity": 1,
      "price": 4.99,
      "menuItemId": 2
    }
  ]
}
```

### 11. UPDATE Order Status

```
PUT http://localhost:3001/api/orders/1

{
  "status": "preparing"
}

Valid Status: pending, preparing, ready, completed
```

### 12. REQUEST Bill

```
PUT http://localhost:3001/api/orders/1/request-bill
```

### 13. CREATE Inventory Item

```
POST http://localhost:3001/api/inventory

{
  "name": "Tomato",
  "currentStock": 100,
  "minStock": 10
}
```

### 14. UPDATE Inventory Item

```
PUT http://localhost:3001/api/inventory/1

{
  "name": "Tomato",
  "currentStock": 80,
  "minStock": 15
}
```

---

## Default Test Credentials

```
Admin:
  Username: admin
  Password: admin

Franchise:
  Username: franchise1
  Password: pass

Chef:
  Username: chef1
  Password: pass

Waiter:
  Username: waiter1
  Password: pass

Manager:
  Username: manager1
  Password: pass
```

---

## Common Issues & Fixes

### Issue 1: 404 Not Found on /api/users

**Cause**: Not sending JWT token in Authorization header
**Fix**: Login first, get token, add to header: `Authorization: Bearer {token}`

### Issue 2: 403 Forbidden

**Cause**: Your user role doesn't have permission
**Fix**: Use admin account or appropriate role

### Issue 3: Database Connection Error

**Cause**: MySQL not running or wrong credentials
**Fix**:

- Check if MySQL is running
- Verify credentials in `backend/models/sequelize.js`
- Create database: `CREATE DATABASE mrbeast_db;`

### Issue 4: 401 Unauthorized

**Cause**: Token is invalid or expired
**Fix**: Login again to get a new token

---

## Testing with cURL

### Example: Login

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Example: Create User (replace TOKEN with your JWT)

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "username":"newuser",
    "password":"pass123",
    "name":"New User",
    "role":"waiter"
  }'
```

### Example: Get All Users

```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer TOKEN"
```

---

## Testing with Postman

1. **Import Collection**:

   - Create new collection "POS API"
   - Create new request for each endpoint

2. **Set Authorization**:

   - In request, go to "Authorization" tab
   - Select "Bearer Token"
   - Paste your JWT token

3. **Environment Variables** (Optional):
   - Create variable: `baseUrl = http://localhost:3001`
   - Create variable: `token` and set it after login
   - Use `{{baseUrl}}` and `{{token}}` in requests

---

## Database Verification

To verify data is being saved to database:

```sql
-- Connect to MySQL
mysql -u root -p

-- Use database
USE mrbeast_db;

-- Check tables
SHOW TABLES;

-- Check users
SELECT * FROM Users;

-- Check orders
SELECT * FROM Orders;

-- Check menu items
SELECT * FROM MenuItems;
```

---

## Next Steps

1. ✅ Ensure MySQL is running
2. ✅ Run backend: `npm start` (in backend folder)
3. ✅ Test login endpoint
4. ✅ Get JWT token
5. ✅ Test other endpoints with token
6. ✅ Verify data in database
