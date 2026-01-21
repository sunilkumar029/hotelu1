# ⚡ Permission System - Quick Start (2 minutes)

## 🎯 What You Need to Do

### Step 1: Initialize Permissions (30 seconds)

```bash
cd backend
node scripts/setupPermissions.js
```

**Expected output:**

```
✅ Database connection established
✅ Database models synchronized
📝 Creating permissions...
  ✓ Created permission: view_users
  ✓ Created permission: create_user
  ... (more)
🔐 Creating roles with permissions...
  ✓ Created role: admin
  ✓ Created role: manager
  ... (more)
✨ Permission setup completed successfully!
```

### Step 2: Restart Backend (30 seconds)

```bash
npm start
```

**You should see:**

```
✅ SUCCESS: MySQL connection established!
✅ Database models synchronized successfully.
✅ Backend server running at http://localhost:3001
```

### Step 3: Test in Frontend (1 minute)

1. **Refresh/reload frontend** (or open in new tab)
2. **Login with admin**:
   - Username: `admin`
   - Password: `admin`
3. **Look for new menu items** in Sidebar:

   - ✨ User Management
   - ✨ Permission Management

4. **Click "Permission Management"**:

   - You'll see "Manage Roles" and "View Permissions" tabs
   - You can create custom roles
   - You can assign permissions to roles

5. **Click "User Management"**:
   - Click "+ Add New User"
   - Create test user:
     - Username: `testuser`
     - Name: `Test User`
     - Password: `test123`
     - Role: `waiter`
   - Click "Create User"
   - You'll see test user in the list

---

## ✨ What's New

### User Management Features

- ✅ **Create users** - Username, password, name, role
- ✅ **View users** - See all users in a table
- ✅ **Edit users** - Change details or role
- ✅ **Delete users** - Remove users from system

### Permission Management Features

- ✅ **Create roles** - Define custom roles
- ✅ **Manage permissions** - Assign/remove permissions
- ✅ **View all permissions** - See 23+ available permissions

---

## 🎮 Try These

### Test 1: Create a Manager User

```
1. User Management
2. "+ Add New User"
3. Fill: testmanager / TestManager / test123 / manager
4. Create
5. See new user in list
```

### Test 2: Create a Custom Role

```
1. Permission Management
2. "Manage Roles" tab
3. Fill Role Name: "supervisor"
4. Description: "Floor supervisor"
5. Check these permissions:
   - create_order
   - view_orders
   - edit_order
6. Create Role
```

### Test 3: Assign Custom Role

```
1. User Management
2. "+ Add New User"
3. Create user "supervisor1"
4. Change role dropdown to "supervisor"
5. Create
```

---

## 📋 Default Roles

| Role             | Users         | Permissions                     |
| ---------------- | ------------- | ------------------------------- |
| **admin**        | Can create    | All 23 permissions              |
| **manager**      | Kitchen staff | Order, Menu, Inventory, Billing |
| **chef**         | Kitchen team  | Orders, Kitchen Display         |
| **waiter**       | Front staff   | Orders, Billing, Payments       |
| **franchise**    | Store owners  | All management features         |
| **subfranchise** | Sub-owners    | Store management                |

---

## 🚀 Next Steps

After verification:

1. ✅ Create users for each role
2. ✅ Test each role in application
3. ✅ Customize permissions as needed
4. ✅ Create additional custom roles
5. ✅ Set up team members

---

## ✅ Verification

After Step 3, you should see:

- ✅ No errors in backend console
- ✅ Frontend loads without errors
- ✅ Can login as admin
- ✅ "User Management" in sidebar
- ✅ "Permission Management" in sidebar
- ✅ Can create users
- ✅ Can manage roles

---

## 🆘 If Something Breaks

### Backend won't start

```bash
# Check database connection
mysql -u root -pMysql@7785

# Create database if missing
CREATE DATABASE mrbeast_db;

# Restart backend
npm start
```

### Setup script fails

```bash
# Check if migrations ran
node scripts/setupPermissions.js

# If error: check MySQL is running
# Then restart backend and try again
```

### No Permission Management menu

```bash
# Must be logged in as admin
# Login: admin / admin

# If still not visible:
- Clear browser cache
- Close and reopen browser
- Hard refresh (Ctrl+Shift+R)
```

---

## 💡 Pro Tips

1. **Create roles before users** - Then assign users to roles
2. **Use default roles first** - Test with admin/manager/chef/waiter
3. **Document custom roles** - Write down what each custom role does
4. **Review permissions quarterly** - Update as your team changes
5. **Backup before major changes** - Export user list regularly

---

## 📞 Quick Reference

| Task               | Location                                          |
| ------------------ | ------------------------------------------------- |
| Create user        | Sidebar → User Management → + Add New User        |
| Edit user          | User Management → Edit button                     |
| Delete user        | User Management → Delete button                   |
| Create role        | Sidebar → Permission Management → Create New Role |
| Assign permissions | Permission Management → Edit Permissions          |
| View all perms     | Permission Management → View Permissions tab      |

---

## ⏱️ Timing

| Step             | Time       | Status       |
| ---------------- | ---------- | ------------ |
| Setup script     | 30 sec     | ✅ Fast      |
| Restart backend  | 30 sec     | ✅ Fast      |
| Test in frontend | 1 min      | ✅ Easy      |
| **Total**        | **~2 min** | **✅ Done!** |

---

**🎉 You're all set! The permission system is ready to use.**

Start with Step 1 and follow through - it takes just 2 minutes!
