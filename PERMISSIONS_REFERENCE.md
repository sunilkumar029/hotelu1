# Complete Permissions & Roles Reference

**System Date:** January 18, 2026  
**Total Permissions:** 25 (5 categories for operations + Admin)  
**Total Roles:** 7

---

## Users & Their Roles

| ID  | Username      | Role         | Name               | Permissions Count | Status                |
| --- | ------------- | ------------ | ------------------ | ----------------- | --------------------- |
| 1   | admin         | admin        | Super Admin        | **24**            | Full Access           |
| 2   | franchise1    | franchise    | Franchise A        | **10**            | Multi-location View   |
| 3   | subfranchise1 | subfranchise | Sub-Franchise X    | **17**            | Full Operational      |
| 4   | manager1      | manager      | Restaurant Manager | **16**            | Day-to-Day Operations |
| 5   | waiter1       | waiter       | John Doe           | **8**             | Order & Billing       |
| 6   | chef1         | chef         | Gordon Ramsay      | **3**             | Kitchen Operations    |
| 7   | customer      | customer     | Customer           | **1**             | QR Ordering Only      |

---

## Complete Permission Mapping

### 1. ADMIN - Super Admin (24 permissions)

**Description:** Full system access with complete control  
**Can Access:**

- ✅ User Management (all features)
- ✅ Menu Management (all operations)
- ✅ Order Management (complete control)
- ✅ Inventory Management (full access)
- ✅ Billing & Payments (all features)
- ✅ Dashboard & Analytics
- ✅ Kitchen Display System
- ✅ System Settings
- ✅ Sub-franchise Management

**Permissions:**

```
User Management (5):
  • view_users - View all users in system
  • create_user - Create new user accounts
  • edit_user - Modify user details
  • delete_user - Remove user accounts
  • manage_roles - Create/edit/delete roles and assign permissions

Menu Management (4):
  • view_menu - Browse menu items
  • create_menu_item - Add new dishes
  • edit_menu_item - Modify dish details/prices
  • delete_menu_item - Remove dishes

Order Management (5):
  • view_orders - See all orders
  • create_order - Enter new orders
  • edit_order - Modify order details
  • delete_order - Cancel/remove orders
  • manage_qr_codes - Create/manage QR code ordering

Inventory Management (2):
  • view_inventory - Check stock levels
  • edit_inventory - Update inventory

Billing (3):
  • view_billing - See billing dashboard
  • process_payments - Handle payments/transactions
  • view_bills - Access bill history

Reporting (3):
  • view_dashboard - Analytics dashboard
  • view_reports - Detailed reports
  • kitchen_display - KDS display system

Settings (2):
  • manage_settings - System configuration
  • manage_subfranchise - Multi-location management
```

**Dashboard Tab:** Full dashboard access  
**Can See:** All features enabled

---

### 2. FRANCHISE - Franchise Owner (10 permissions)

**Description:** Manages multiple sub-franchises, receives aggregated reports  
**Can Access:**

- ✅ Franchise Dashboard
- ✅ View all sub-franchise users
- ✅ View consolidated reports
- ✅ Menu viewing across locations
- ✅ Sub-franchise management

**Permissions:**

```
User Management (4):
  • view_users - View all staff across franchises
  • create_user - Create sub-franchise users
  • edit_user - Edit user details
  • manage_roles - Assign roles to users

Menu Management (1):
  • view_menu - View menu (read-only)

Order Management (2):
  • view_orders - See all orders across franchises
  • manage_qr_codes - Manage QR codes

Reporting (2):
  • view_dashboard - Franchise dashboard with aggregated data
  • view_reports - Consolidated reports across locations

Settings (1):
  • manage_subfranchise - Add/manage sub-franchises
```

**Dashboard Tab:** Franchise Dashboard  
**Can See:**

- Franchise Dashboard (active)
- Sub-Franchise Management
- Reports from all locations

---

### 3. SUBFRANCHISE - Sub-Franchise Owner (17 permissions)

**Description:** Full operational control for single location  
**Can Access:**

- ✅ All menu operations
- ✅ Order management (create/edit)
- ✅ Inventory control
- ✅ Billing & payments
- ✅ Kitchen operations
- ✅ QR code ordering
- ✅ Staff management (limited)

**Permissions:**

```
User Management (3):
  • view_users - View location staff
  • create_user - Add staff members
  • edit_user - Edit staff details

Menu Management (4):
  • view_menu - View menu items
  • create_menu_item - Add new items
  • edit_menu_item - Modify items
  • delete_menu_item - Remove items

Order Management (5):
  • view_orders - See all orders
  • create_order - Create new orders
  • edit_order - Modify orders
  • delete_order - Cancel orders
  • manage_qr_codes - QR code management

Inventory Management (2):
  • view_inventory - Check stock
  • edit_inventory - Update inventory

Billing (2):
  • view_billing - Billing info
  • view_bills - Bill history

Reporting (3):
  • view_dashboard - Location dashboard
  • kitchen_display - KDS access
  (view_reports - NOT included)
```

**Dashboard Tab:** Main Dashboard  
**Can See:**

- Dashboard (active)
- Menu Management
- Order Management
- Inventory Management
- Billing
- Kitchen Display System
- Dine-In Management
- Takeaway Management
- QR Management

---

### 4. MANAGER - Restaurant Manager (16 permissions)

**Description:** Day-to-day operational management  
**Can Access:**

- ✅ Order management
- ✅ Menu operations
- ✅ Inventory management
- ✅ Billing access
- ✅ Staff viewing
- ✅ Reports

**Permissions:**

```
User Management (3):
  • view_users - View staff
  • create_user - Create staff accounts
  • edit_user - Edit staff info

Menu Management (2):
  • view_menu - View menu
  • create_menu_item - Add items
  • edit_menu_item - Edit items
  (No delete permission)

Order Management (4):
  • view_orders - See orders
  • create_order - Create orders
  • edit_order - Modify orders
  • manage_qr_codes - QR codes

Inventory Management (2):
  • view_inventory - Check stock
  • edit_inventory - Update stock

Billing (2):
  • view_billing - Billing info
  • view_bills - Bill history

Reporting (2):
  • view_dashboard - Dashboard access
  • view_reports - Reports access
```

**Dashboard Tab:** Main Dashboard  
**Can See:**

- Dashboard
- Menu Management (limited)
- Order Management
- Inventory Management
- Billing
- Dine-In/Takeaway Management
- QR Management

---

### 5. WAITER - Waiter/Server (8 permissions)

**Description:** Takes orders and processes payments  
**Can Access:**

- ✅ Order entry
- ✅ Menu browsing
- ✅ Payment processing
- ✅ Bill access
- ✅ QR code ordering

**Permissions:**

```
Menu Management (1):
  • view_menu - View menu items

Order Management (4):
  • view_orders - See orders
  • create_order - Create new orders
  • edit_order - Modify orders
  • manage_qr_codes - QR code access

Billing (3):
  • view_billing - Billing info
  • process_payments - Process payments
  • view_bills - View bills
```

**Dashboard Tab:** Dine-In Management (default)  
**Can See:**

- Dine-In Management
- Takeaway Management
- Menu view
- Billing
- QR Ordering access

**Cannot See:**

- Dashboard
- Inventory
- Menu Management
- User Management

---

### 6. CHEF - Kitchen Staff (3 permissions)

**Description:** Prepares and tracks orders  
**Can Access:**

- ✅ Order viewing
- ✅ Menu browsing
- ✅ Kitchen Display System

**Permissions:**

```
Menu Management (1):
  • view_menu - View menu items

Order Management (1):
  • view_orders - See orders

Reporting (1):
  • kitchen_display - Kitchen Display System (KDS)
```

**Dashboard Tab:** Kitchen Display System (default)  
**Can See:**

- Kitchen Display System ONLY
- Menu (read-only)

**Cannot See:**

- Dashboard
- Billing
- Inventory
- Order creation/editing

---

### 7. CUSTOMER - Guest Customer (1 permission)

**Description:** QR code ordering access only  
**Can Access:**

- ✅ QR code ordering

**Permissions:**

```
Order Management (1):
  • manage_qr_codes - QR ordering access
```

**Dashboard Tab:** QR Code Ordering  
**Can See:**

- QR Code Ordering page ONLY
- No authentication required for this feature

**Cannot See:**

- Any admin/staff features
- Billing
- Dashboard

---

## Access Matrix by Tab

| Tab                    | Admin | Franchise | SubFranchise | Manager | Waiter | Chef | Customer |
| ---------------------- | ----- | --------- | ------------ | ------- | ------ | ---- | -------- |
| Dashboard              | ✅    | ✅        | ✅           | ✅      | ❌     | ❌   | ❌       |
| Franchise Dashboard    | ✅    | ✅        | ❌           | ❌      | ❌     | ❌   | ❌       |
| Sub-Franchise Mgmt     | ✅    | ✅        | ❌           | ❌      | ❌     | ❌   | ❌       |
| Menu Management        | ✅    | ❌        | ✅           | ✅      | ❌     | ❌   | ❌       |
| Order Management       | ✅    | ❌        | ✅           | ✅      | ✅     | ❌   | ❌       |
| Dine-In Management     | ✅    | ❌        | ✅           | ✅      | ✅     | ❌   | ❌       |
| Takeaway Management    | ✅    | ❌        | ✅           | ✅      | ✅     | ❌   | ❌       |
| QR Management          | ✅    | ✅        | ✅           | ✅      | ✅     | ❌   | ❌       |
| Inventory Management   | ✅    | ❌        | ✅           | ✅      | ❌     | ❌   | ❌       |
| Billing                | ✅    | ❌        | ✅           | ✅      | ✅     | ❌   | ❌       |
| Kitchen Display System | ✅    | ❌        | ✅           | ❌      | ❌     | ✅   | ❌       |
| User Management        | ✅    | ❌        | ❌           | ❌      | ❌     | ❌   | ❌       |
| Permission Management  | ✅    | ❌        | ❌           | ❌      | ❌     | ❌   | ❌       |
| QR Code Ordering       | ✅    | ❌        | ❌           | ❌      | ❌     | ❌   | ✅       |

---

## Permission Summary by Category

### User Management (5 total)

- **Admin** can: view, create, edit, delete users + manage roles
- **Franchise** can: view, create, edit users + manage roles
- **SubFranchise** can: view, create, edit users
- **Manager** can: view, create, edit users
- **Waiter/Chef/Customer** cannot: access

### Menu Management (4 total)

- **Admin/SubFranchise** can: view, create, edit, delete
- **Manager** can: view, create, edit (no delete)
- **Waiter/Chef** can: view only
- **Franchise/Customer** cannot: access

### Order Management (5 total)

- **Admin/SubFranchise/Manager** can: view, create, edit, delete + manage QR codes
- **Waiter** can: view, create, edit + manage QR codes (no delete)
- **Chef** can: view only
- **Franchise** can: view + manage QR codes
- **Customer** can: manage QR codes only

### Inventory Management (2 total)

- **Admin/SubFranchise/Manager** can: view and edit
- **Franchise/Waiter/Chef/Customer** cannot: access

### Billing (3 total)

- **Admin/SubFranchise/Manager** can: view billing + view bills
- **Waiter** can: view billing, process payments, view bills
- **Chef/Franchise/Customer** cannot: access

### Reporting (3 total)

- **Admin** can: view dashboard, view reports, access KDS
- **Franchise** can: view dashboard, view reports
- **SubFranchise** can: view dashboard, access KDS (no reports)
- **Manager** can: view dashboard, view reports
- **Waiter/Chef/Customer** cannot: access

### Settings (2 total)

- **Admin** can: manage settings, manage subfranchises
- **Franchise** can: manage subfranchises
- Others cannot: access

---

## Implementation Notes

1. **Frontend Routes** (App.jsx) enforce role-based access
2. **Backend API** should validate permissions for each endpoint
3. **Permission Middleware** checks JWT token + role permissions
4. **Permission Management UI** allows admin to create/modify roles
5. **Default Roles** are auto-created on first backend startup
6. **Customer Role** is for QR code ordering (guest access)

### To Apply These Permissions:

```bash
cd backend
node scripts/setupPermissions.js
npm start
```

### Testing with Users:

```
Admin: admin/admin → Full access
Franchise: franchise1/* → Multi-location view
Manager: manager1/* → Day-to-day operations
Waiter: waiter1/* → Order taking
Chef: chef1/* → Kitchen only
Customer: customer/* → QR ordering only
```
