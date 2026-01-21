# 🔐 New Permission Management System - User Guide

## Overview

The new Permission Management system has been redesigned to be **simple, intuitive, and user-friendly** for restaurant staff at all technical levels.

---

## 🎨 What's Improved?

### **Before (Old Version):**

❌ Too many checkboxes  
❌ Confusing permission names  
❌ No explanation of what permissions do  
❌ Not mobile-friendly  
❌ Hard to understand role setup

### **After (New Version):**

✅ Visual role cards  
✅ Simple, plain-language descriptions  
✅ Color-coded permission categories with icons  
✅ Mobile-friendly design  
✅ Permission groups make sense  
✅ One-click role templates (coming soon)

---

## 📱 User Interface Breakdown

### **Main Screen - Two Simple Tabs**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🔐 System Access Control                              │
│     Manage who can do what in your restaurant           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 👥 Manage Roles (Jobs)  │  🔓 View Permissions │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 Tab 1: Manage Roles (Jobs)

This is where you **create and assign job titles and permissions**.

### **Creating a New Role**

**Step 1: Click "➕ Create New Role / Job Title"**

```
┌────────────────────────────────────────────────────────┐
│  ➕ Create New Role / Job Title                        │
└────────────────────────────────────────────────────────┘
```

**Step 2: Fill in Role Details**

```
┌────────────────────────────────────────────────────────┐
│  Create New Role                                       │
│                                                        │
│  Role/Job Title Name:                                  │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Senior Waiter                                    │ │
│  └──────────────────────────────────────────────────┘ │
│  (e.g., Senior Waiter, Assistant Chef)               │
│                                                        │
│  Description:                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Takes orders, manages tables, handles payments   │ │
│  └──────────────────────────────────────────────────┘ │
│  (What does this person do?)                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Step 3: Select Permissions (What they can do)**

The system shows **7 permission categories**, each with **simple descriptions**:

```
┌─────────────────────────────────────────────────────────┐
│  What can they do? (Select all that apply)              │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ 👥 User Management  │  │ 🍽️ Menu Management │     │
│  │ Control who can access the system              │     │
│  │                     │  │                       │     │
│  │ ☐ View Staff List   │  │ ☐ View Menu         │     │
│  │   See all employees │  │   See all dishes    │     │
│  │                     │  │                       │     │
│  │ ☐ Add New Staff     │  │ ☑ Add Dishes        │     │
│  │   Create accounts   │  │   Add new items     │     │
│  │                     │  │                       │     │
│  │ ☐ Edit Staff Info   │  │ ☐ Edit Dishes       │     │
│  │   Change details    │  │   Change prices     │     │
│  │                     │  │                       │     │
│  │ ☐ Assign Roles      │  │ ☐ Remove Dishes     │     │
│  │   Give job titles   │  │   Delete items      │     │
│  │                     │  │                       │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ 📋 Order Management │  │ 📦 Inventory        │     │
│  │ Handle customer orders                      │     │
│  │                     │  │                       │     │
│  │ ☑ View Orders      │  │ ☑ Check Stock       │     │
│  │ ☑ Create Orders    │  │ ☐ Update Stock      │     │
│  │ ☑ Edit Orders      │  │                       │     │
│  │ ☐ Cancel Orders    │  │                       │     │
│  │ ☑ QR Ordering      │  │                       │     │
│  │   (via QR codes)    │  │                       │     │
│  │                     │  │                       │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ 💳 Billing          │  │ 📊 Dashboard        │     │
│  │ Process payments    │  │ View reports        │     │
│  │                     │  │                       │     │
│  │ ☑ Process Payments  │  │ ☐ View Dashboard    │     │
│  │ ☐ View Bills        │  │ ☐ View Reports      │     │
│  │ ☐ Bill History      │  │ ☑ Kitchen Display   │     │
│  │                     │  │                       │     │
│  │                     │  │ ⚙️ System Settings  │     │
│  │                     │  │                       │     │
│  │                     │  │ ☐ System Settings    │     │
│  │                     │  │ ☐ Multi-Location    │     │
│  │                     │  │                       │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Step 4: Save the Role**

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  [✓ Create Role]          [✕ Cancel]                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

✅ **Success!** You'll see: "Role created successfully! ✓"

---

### **View & Edit Existing Roles**

After creating roles, you'll see them listed:

```
┌─────────────────────────────────────────────────────────┐
│  Existing Roles                                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Senior Waiter                                   ▼ │ │
│  │ Takes orders, manages tables, handles payments   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Chef / Kitchen                                  ▼ │ │
│  │ Prepares food and tracks orders                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Manager                                         ▼ │ │
│  │ Oversees operations and reports                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**To edit a role's permissions:** Click the role card to expand it

```
┌───────────────────────────────────────────────────────┐
│ Senior Waiter                                       ▲ │
│ Takes orders, manages tables, handles payments     │ │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Current Permissions: 8                             │
│                                                       │
│  ✓ View Orders    ✓ Create Orders   ✓ Edit Orders  │
│  ✓ Process Payments  ✓ Check Stock                  │
│                                                       │
│  [✏️ Edit Permissions]                              │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**Click "✏️ Edit Permissions"** to modify

```
┌───────────────────────────────────────────────────────┐
│  Permission categories appear (same as create)       │
│  ☑ Check/uncheck boxes to add or remove access      │
│                                                       │
│  [✓ Save Changes]   [✕ Cancel]                      │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 🔓 Tab 2: View Permissions

This shows **ALL available permissions** organized by category.

```
┌─────────────────────────────────────────────────────────┐
│  📋 All Available Permissions                           │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │ 👥 User          │  │ 🍽️ Menu          │           │
│  │ Management       │  │ Management       │           │
│  │ Control staff    │  │ Manage items     │           │
│  │ access           │  │                  │           │
│  │                  │  │                  │           │
│  │ View Staff List  │  │ View Menu        │           │
│  │ See all empls    │  │ See all dishes   │           │
│  │                  │  │                  │           │
│  │ Add New Staff    │  │ Add Dishes       │           │
│  │ Create accounts  │  │ Add new items    │           │
│  │                  │  │                  │           │
│  │ Edit Staff Info  │  │ Edit Dishes      │           │
│  │ Change details   │  │ Change prices    │           │
│  │                  │  │                  │           │
│  │ Remove Staff     │  │ Remove Dishes    │           │
│  │ Delete accounts  │  │ Delete items     │           │
│  │                  │  │                  │           │
│  │ Assign Roles     │  │                  │           │
│  │ Give job titles  │  │                  │           │
│  │                  │  │                  │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                         │
│  [More permission categories...]                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Common Role Examples

### **👑 Super Admin**

**Can do:** Everything  
**Permissions:** 24 out of 25 permissions

### **👔 Restaurant Manager**

**Can do:**

- View and manage staff
- View menu and orders
- Check inventory
- View dashboard and reports
- Process payments

**Permissions:** 15+ permissions

### **🤵 Waiter/Server**

**Can do:**

- View menu
- Create and edit orders
- Process payments
- View existing orders for table
- Support QR ordering

**Permissions:** 8 permissions

### **👨‍🍳 Chef/Kitchen**

**Can do:**

- View orders (kitchen display)
- See order items and table numbers
- Mark items as ready
- Check inventory for ingredients

**Permissions:** 6 permissions

### **🏢 Franchise Owner**

**Can do:**

- View all locations
- See reports and analytics
- Manage managers at each location
- View revenue

**Permissions:** 12+ permissions

---

## 💡 Permission Categories Explained

### **1. 👥 User Management**

**What it controls:** Who can manage staff

- View all employees
- Add new employees
- Edit employee information
- Remove employees
- Assign job titles (roles)

### **2. 🍽️ Menu Management**

**What it controls:** Who can manage menu items

- View all menu dishes
- Add new dishes
- Edit prices and descriptions
- Remove dishes from menu

### **3. 📋 Order Management**

**What it controls:** Who can manage orders

- View all orders
- Create new orders
- Edit existing orders
- Cancel orders
- Allow QR code ordering

### **4. 📦 Inventory Management**

**What it controls:** Stock management

- Check current stock levels
- Update stock quantities
- Track ingredients

### **5. 💳 Billing & Payments**

**What it controls:** Financial operations

- View bills and invoices
- Process payments (cash, card, UPI)
- View payment history

### **6. 📊 Dashboard & Reports**

**What it controls:** Analytics and monitoring

- View sales dashboard
- View detailed reports
- Access kitchen display system

### **7. ⚙️ System Settings**

**What it controls:** System configuration

- Change system settings
- Manage multi-location setup

---

## 🎓 How to Use (Step-by-Step)

### **Scenario 1: Hire a New Waiter**

1. **Go to User Management** → Add new user
2. **Go to Permission Management** → Manage Roles tab
3. **Find "Waiter" role** or create one if needed
4. **Assign that role to new waiter** in User Management
5. **Waiter automatically gets all waiter permissions**

### **Scenario 2: Promote Someone to Senior Waiter**

1. **Go to Permission Management** → Manage Roles tab
2. **Edit "Senior Waiter" role**
3. **Add extra permissions** (e.g., View Reports, Manage QR)
4. **Change user's role in User Management** to "Senior Waiter"
5. **New permissions take effect immediately**

### **Scenario 3: Restrict a Chef from Viewing Reports**

1. **Go to Permission Management** → Manage Roles tab
2. **Find "Chef" role**
3. **Click "✏️ Edit Permissions"**
4. **Uncheck "View Dashboard" and "View Reports"**
5. **Click "✓ Save Changes"**
6. **All chefs lose report access** (permissions take effect immediately)

---

## 🔒 Security Notes

✅ **Only admin can manage roles and permissions**  
✅ **Users can't access pages they don't have permission for**  
✅ **Permissions are enforced on both frontend AND backend**  
✅ **Changes take effect immediately** (no page reload needed)  
✅ **Audit trail** - All actions are logged (coming soon)

---

## ❓ FAQ

**Q: Can I create custom roles?**  
A: Yes! Click "Create New Role / Job Title" and select any combination of permissions.

**Q: If I change a role's permissions, does it affect all users with that role?**  
A: Yes! All users with that role get the new permissions immediately.

**Q: Can someone have multiple roles?**  
A: Currently one role per user. You can create roles that combine permissions.

**Q: What happens if I remove a permission?**  
A: Users with that role can no longer access that feature.

**Q: Can I delete a role?**  
A: Not yet - all roles are permanent to maintain history.

---

## 🚀 Best Practices

1. **Create specific roles** - Instead of giving everyone admin, create tailored roles
2. **Review regularly** - Check permissions quarterly or when staff changes
3. **Test thoroughly** - After creating a role, test that user can access correct features
4. **Document changes** - Keep notes on why permissions were changed
5. **Start restrictive** - Give minimum permissions, add as needed

---

## ✨ Key Features at a Glance

✅ **Simple, plain-language descriptions**  
✅ **Color-coded categories with icons**  
✅ **One-click role creation**  
✅ **Easy editing of existing roles**  
✅ **Mobile-friendly design**  
✅ **No technical jargon**  
✅ **Instant permission updates**  
✅ **Visual permission preview**

---

**Ready to set up your team? Start by creating your first role! 🎯**
