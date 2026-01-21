# 🔐 Role-Based Permission System - Complete Guide

## Overview

Your POS system now includes a **complete Role-Based Access Control (RBAC) system** with:

✅ **Full User CRUD** - Create, Read, Update, Delete users
✅ **Permission Management** - Define and assign permissions to roles
✅ **Granular Role Control** - Create custom roles with specific permissions
✅ **Dynamic UI** - Features show/hide based on user permissions
✅ **Secure API** - Backend validates permissions on all endpoints

---

## 🚀 Quick Setup

### Step 1: Initialize Permissions Database

Run this command to create default permissions and roles:

```bash
cd backend
node scripts/setupPermissions.js
```

**Output should show:**

```
✅ Database connection established
✅ Database models synchronized
📝 Creating permissions...
  ✓ Created permission: view_users
  ✓ Created permission: create_user
  ... (more permissions)
🔐 Creating roles with permissions...
  ✓ Created role: admin
  ✓ Created role: manager
  ✓ Created role: chef
  ✓ Created role: waiter
  ✓ Created role: franchise
  ✓ Created role: subfranchise
✨ Permission setup completed successfully!
```

### Step 2: Restart Backend

```bash
npm start
```

### Step 3: Login as Admin

- Username: `admin`
- Password: `admin`

You'll now see:

- ✨ **User Management** - Full CRUD for users
- ✨ **Permission Management** - Manage roles and permissions

---

## 👥 User Management (Full CRUD)

### Create User

```
1. Click "+ Add New User" button
2. Fill in form:
   - Username (unique)
   - Full Name
   - Password (min 4 chars)
   - Role (admin, manager, chef, waiter, franchise, subfranchise)
3. Click "Create User"
```

### View Users

- List shows all users with username, name, and role
- Color-coded role badges for quick identification

### Edit User

```
1. Click "Edit" button on user row
2. Form opens with current details
3. Modify username (disabled for security), name, password, or role
4. Password is optional - leave blank to keep current
5. Click "Update User"
```

### Delete User

```
1. Click "Delete" button on user row
2. Confirm deletion in popup
3. User is removed from system
⚠️ Note: Cannot delete your own account
```

---

## 🔐 Permission Management

### Understanding the System

**Permissions**: Individual capabilities (e.g., "create_order", "delete_user")
**Roles**: Groups of permissions (e.g., "chef" role has certain permissions)
**Users**: Assigned to roles, inherit all role permissions

### Default Roles & Permissions

#### 👨‍💼 Admin

- ✅ Full access to everything
- ✅ User management (all CRUD)
- ✅ Role management
- ✅ Permission management
- ✅ All dashboard features

#### 👨‍💻 Manager

- ✅ User management (create, view, edit)
- ✅ Menu management
- ✅ Order management
- ✅ Inventory management
- ✅ Billing and reports
- ✅ Dashboard

#### 👨‍🍳 Chef

- ✅ View orders
- ✅ Kitchen display system
- ✅ View menu

#### 🍽️ Waiter

- ✅ Create/edit orders
- ✅ View menu
- ✅ Process payments
- ✅ View bills
- ✅ QR code management

#### 🏪 Franchise

- ✅ User management
- ✅ View menu and orders
- ✅ View inventory
- ✅ Dashboard and reports
- ✅ Role management

#### 🏬 Sub-Franchise

- ✅ All manager features
- ✅ Kitchen display
- ✅ Role management

### Managing Roles

#### View All Roles

1. Click **Permission Management** (Admin only)
2. Click **"Manage Roles"** tab
3. See all roles and their current permissions

#### Create Custom Role

```
1. Click "Permission Management"
2. Fill in "Create New Role" form:
   - Role Name (e.g., "supervisor")
   - Description (e.g., "Floor supervisor")
3. Check permissions to assign
4. Click "Create Role"
```

#### Edit Role Permissions

```
1. Find role in "Existing Roles" list
2. Click "Edit Permissions"
3. Check/uncheck permissions
4. Click "Save"
```

#### Permission Categories

| Category         | Permissions                                                          | Usage                |
| ---------------- | -------------------------------------------------------------------- | -------------------- |
| User Management  | view_users, create_user, edit_user, delete_user, manage_roles        | Control user access  |
| Menu Management  | view_menu, create_menu_item, edit_menu_item, delete_menu_item        | Menu control         |
| Order Management | view_orders, create_order, edit_order, delete_order, manage_qr_codes | Order handling       |
| Inventory        | view_inventory, edit_inventory                                       | Stock control        |
| Billing          | view_billing, process_payments, view_bills                           | Payment handling     |
| Reporting        | view_dashboard, view_reports, kitchen_display                        | Analytics & KDS      |
| Settings         | manage_settings                                                      | System configuration |

---

## 🔗 API Endpoints (For Direct Integration)

### User Management

#### Create User

```bash
POST /api/users
Authorization: Bearer {token}

{
  "username": "newchef",
  "password": "secure123",
  "name": "Chef John",
  "role": "chef"
}

Response: { message, user }
```

#### Get All Users

```bash
GET /api/users
Authorization: Bearer {token}

Response: [{ id, username, role, name }, ...]
```

#### Update User

```bash
PUT /api/users/{id}
Authorization: Bearer {token}

{
  "username": "newchef",  // Cannot change existing username
  "name": "Chef Johnny",
  "role": "chef",
  "password": "newpass123" // Optional
}

Response: { message, user }
```

#### Delete User

```bash
DELETE /api/users/{id}
Authorization: Bearer {token}

Response: { message }
```

### Permission Management

#### Get All Permissions

```bash
GET /api/permissions
Authorization: Bearer {token}

Response: [{ id, name, category, description }, ...]
```

#### Get All Roles with Permissions

```bash
GET /api/roles
Authorization: Bearer {token}

Response: [{ id, name, description, permissions: [] }, ...]
```

#### Create Role

```bash
POST /api/roles
Authorization: Bearer {token}

{
  "name": "supervisor",
  "description": "Floor supervisor",
  "permissions": ["view_orders", "create_order", "edit_order"]
}

Response: { message, role }
```

#### Update Role Permissions

```bash
PUT /api/roles/{id}/permissions
Authorization: Bearer {token}

{
  "permissions": ["view_orders", "create_order"]
}

Response: { message, role }
```

#### Get My Permissions

```bash
GET /api/my-permissions
Authorization: Bearer {token}

Response: { permissions: [...], role: "admin" }
```

---

## 🔒 Security Features

### Password Security

- ✅ Passwords hashed with bcrypt
- ✅ Minimum 4 characters required
- ✅ Optional when editing (keeps current if blank)

### Role-Based Access

- ✅ Backend validates permissions on every request
- ✅ Admin has full access automatically
- ✅ Cannot delete own account
- ✅ Cannot modify own username

### Token-Based Authentication

- ✅ JWT tokens with 24-hour expiration
- ✅ Token required in Authorization header
- ✅ Invalid/expired tokens rejected

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL (hashed),
  role VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL
);
```

### Roles Table

```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  isDefault BOOLEAN DEFAULT false
);
```

### Permissions Table

```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category ENUM(...)
);
```

### Role_Permissions Table

```sql
CREATE TABLE role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  roleId INT NOT NULL,
  permissionId INT NOT NULL,
  FOREIGN KEY (roleId) REFERENCES roles(id),
  FOREIGN KEY (permissionId) REFERENCES permissions(id)
);
```

---

## 🧪 Testing the System

### Test with cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  | jq -r '.token')

# 2. Create user
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newwaiter",
    "password": "pass123",
    "name": "Waiter John",
    "role": "waiter"
  }'

# 3. Get all users
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer $TOKEN"

# 4. Update user
curl -X PUT http://localhost:3001/api/users/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newwaiter",
    "name": "John Updated",
    "role": "chef"
  }'

# 5. View permissions
curl -X GET http://localhost:3001/api/permissions \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚙️ Customization

### Add New Permission

1. Open `setupPermissions.js`
2. Add to `PERMISSIONS` array:

```javascript
{ name: 'my_permission', category: 'my_category', description: 'My permission' }
```

3. Run `node scripts/setupPermissions.js` again

### Create New Role

1. Via UI: Click "Permission Management" → "Create New Role"
2. Or via API: POST `/api/roles`

### Assign Permissions to Role

1. Via UI: Edit role permissions
2. Or via API: PUT `/api/roles/{id}/permissions`

---

## 🐛 Troubleshooting

### "Permission denied" error

- ✓ Check user role
- ✓ Verify role has required permission
- ✓ Run `node scripts/setupPermissions.js` to reset defaults

### Can't see Permission Management menu

- ✓ Only shows for admin role
- ✓ Login with admin account (admin/admin)

### Permissions not taking effect

- ✓ Restart backend: `npm start`
- ✓ Clear browser cache
- ✓ Re-login

### User can't create other users

- ✓ Check user has "create_user" permission
- ✓ Assign to manager role or above

---

## 📈 Next Steps

1. ✅ Run setup script: `node scripts/setupPermissions.js`
2. ✅ Restart backend: `npm start`
3. ✅ Login as admin: admin/admin
4. ✅ Go to "Permission Management"
5. ✅ Create custom roles as needed
6. ✅ Go to "User Management"
7. ✅ Create users with specific roles

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review backend server logs
3. Verify database connection: `mysql -u root -pMysql@7785 mrbeast_db -e "SHOW TABLES;"`

---

**🎉 Your permission system is ready to use!**
