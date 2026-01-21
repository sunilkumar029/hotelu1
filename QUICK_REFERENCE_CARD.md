# 🚀 Quick Reference Card

## Files to Read (In Order)

1. **QUICK_START_GUIDE.md** - Setup & first run
2. **API_TESTING_GUIDE.md** - All endpoints
3. **AUDIT_SUMMARY.md** - Full overview
4. **ISSUES_AND_SOLUTIONS.md** - Detailed analysis

---

## Quick Start (5 Steps)

### 1️⃣ Verify MySQL Running

```bash
netstat -ano | findstr :3306
```

### 2️⃣ Create Database

```bash
mysql -u root -pMysql@7785
CREATE DATABASE mrbeast_db;
```

### 3️⃣ Start Backend

```bash
cd backend
npm start
```

**Look for**: ✅ MySQL connection established

### 4️⃣ Test API

```bash
node api-test-complete.js
```

**This will**:

- Login as admin
- Get JWT token
- Create users, orders, menu items
- Show all responses

### 5️⃣ Verify Data

```bash
mysql -u root -pMysql@7785 mrbeast_db
SELECT * FROM Users;
```

---

## API Testing Methods

### Method 1: Node Script (Easiest)

```bash
node api-test-complete.js
```

Automatically tests all endpoints

### Method 2: cURL

```bash
# 1. Login
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# 2. Copy token from response

# 3. Get users (replace TOKEN)
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer TOKEN"
```

### Method 3: Postman

1. POST http://localhost:3001/login
2. Body: `{"username":"admin","password":"admin"}`
3. Copy token from response
4. New request: GET http://localhost:3001/api/users
5. Auth tab → Bearer Token → Paste token
6. Send

---

## JWT Token Flow

```
Login → Get Token → Store Token → Send in Headers
```

### 1. Login

```
POST http://localhost:3001/login
{
  "username": "admin",
  "password": "admin"
}
```

### 2. Server Returns

```
{
  "token": "eyJhbGc...",
  "user": { "username": "admin", "role": "admin", "name": "Admin User" }
}
```

### 3. Store Token

```
Authorization: Bearer eyJhbGc...
```

### 4. Send with Request

```
GET /api/users
Authorization: Bearer eyJhbGc...
```

---

## Test Users

| User          | Password | Role         |
| ------------- | -------- | ------------ |
| admin         | admin    | admin        |
| franchise1    | pass     | franchise    |
| subfranchise1 | pass     | subfranchise |
| manager1      | pass     | manager      |
| waiter1       | pass     | waiter       |
| chef1         | pass     | chef         |

---

## All Endpoints

### 🔓 Public (No Auth)

- `POST /login` → Get token
- `GET /api/menu` → Get menu items
- `GET /api/orders` → Get orders
- `GET /api/inventory` → Get inventory

### 🔒 Protected (Admin Only)

- `GET /api/users` → Get all users
- `POST /api/users` → Create user
- `POST /api/menu` → Create menu
- `PUT /api/menu/:id` → Update menu
- `DELETE /api/menu/:id` → Delete menu
- `POST /api/orders` → Create order
- `PUT /api/orders/:id` → Update order
- `PUT /api/orders/:id/request-bill` → Request bill
- `POST /api/inventory` → Create inventory
- `PUT /api/inventory/:id` → Update inventory

---

## Example: Create New User

### Step 1: Get Token

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Returns: { token: "..." }
```

### Step 2: Create User

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newchef",
    "password": "pass123",
    "name": "New Chef",
    "role": "chef"
  }'
```

### Step 3: Verify in Database

```bash
mysql -u root -pMysql@7785 mrbeast_db
SELECT * FROM Users;
```

---

## Example: Create Order

```bash
# Need token first (see above)

curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "T1",
    "type": "DINE_IN",
    "status": "pending",
    "total": 45.99,
    "items": [
      {
        "name": "Burger",
        "quantity": 2,
        "price": 19.99,
        "menuItemId": 1
      }
    ]
  }'
```

---

## Troubleshooting

### 404 Not Found

❌ Problem: `/api/users` returns 404  
✅ Fix: Did you include JWT token in Authorization header?

### 401 Unauthorized

❌ Problem: Invalid token error  
✅ Fix: Login again to get fresh token

### 403 Forbidden

❌ Problem: Only admins can do this  
✅ Fix: Use admin account (admin/admin)

### Database Connection Failed

❌ Problem: Backend shows DB error  
✅ Fix: Start MySQL service, create database

### No Data After API Call

❌ Problem: Data created but not in database  
✅ Fix: Check if Backend shows ✅ MySQL connected

---

## Database Commands

```bash
# Connect
mysql -u root -pMysql@7785

# Use database
USE mrbeast_db;

# Show tables
SHOW TABLES;

# Check users
SELECT * FROM Users;

# Check orders
SELECT * FROM Orders;

# Check menu items
SELECT * FROM MenuItems;

# Count records
SELECT COUNT(*) FROM Users;
```

---

## Server Status Indicators

### ✅ Good - You'll See

```
✅ MySQL connection established.
✅ Database models synchronized successfully.
✅ Backend server running at http://localhost:3001
```

### ❌ Bad - Server Won't Start

```
❌ Unable to connect to MySQL
❌ Make sure database 'mrbeast_db' exists
```

---

## Files Created

| File                      | Purpose               |
| ------------------------- | --------------------- |
| `QUICK_START_GUIDE.md`    | Step-by-step setup    |
| `API_TESTING_GUIDE.md`    | Complete API docs     |
| `AUDIT_SUMMARY.md`        | Full overview         |
| `ISSUES_AND_SOLUTIONS.md` | Detailed analysis     |
| `api-test-complete.js`    | Automated tests       |
| `server-improved.js`      | Better server version |
| `QUICK_REFERENCE_CARD.md` | This file             |

---

## One-Minute Summary

```
1. Start MySQL
2. Create database: mrbeast_db
3. npm start (in backend)
4. node api-test-complete.js
5. Check database with mysql CLI
6. Done! ✅
```

---

**Next Step**: Open `QUICK_START_GUIDE.md` 👈
