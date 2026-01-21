const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const Inventory = require("./models/Inventory");
const Permission = require("./models/Permission");
const Role = require("./models/Role");
const RolePermission = require("./models/RolePermission");
const Bill = require("./models/Bill");
const bcrypt = require("bcrypt");

const app = express();
const port = 3001; // Choose a port for your backend
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing JSON request bodies

// Mock data for demo mode
const mockOrders = [
  {
    id: 1,
    table_name: "T1",
    status: "pending",
    total: 25.99,
    timestamp: new Date(),
    type: "DINE_IN",
    items: [
      { id: 1, name: "Burger", quantity: 2, price: 12.99 },
      { id: 2, name: "Fries", quantity: 1, price: 4.99 },
    ],
  },
  {
    id: 2,
    table_name: "Takeaway",
    status: "preparing",
    total: 18.5,
    timestamp: new Date(Date.now() - 3600000),
    type: "TAKEAWAY",
    items: [
      { id: 3, name: "Pizza", quantity: 1, price: 15.5 },
      { id: 4, name: "Soda", quantity: 1, price: 3.0 },
    ],
  },
];

const mockMenuItems = [
  {
    id: 1,
    name: "Classic Burger",
    price: 19.99,
    category: "Main Course",
    description: "Beef burger with lettuce, tomato, and cheese",
  },
  {
    id: 2,
    name: "French Fries",
    price: 4.99,
    category: "Side",
    description: "Crispy golden fries",
  },
  {
    id: 3,
    name: "Margherita Pizza",
    price: 15.5,
    category: "Main Course",
    description: "Classic pizza with tomato and mozzarella",
  },
  {
    id: 4,
    name: "Coca Cola",
    price: 3.0,
    category: "Beverage",
    description: "Cold drink",
  },
];

const mockInventory = [
  { id: 1, name: "Beef Patty", currentStock: 50, minStock: 10 },
  { id: 2, name: "Burger Buns", currentStock: 100, minStock: 20 },
  { id: 3, name: "Potatoes", currentStock: 25, minStock: 5 },
  { id: 4, name: "Pizza Dough", currentStock: 30, minStock: 8 },
];

const sequelize = require("./models/sequelize");

let dbConnected = false;

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connection established.");
    dbConnected = true;
  })
  .catch((err) => {
    console.error("Unable to connect to MySQL:", err);
    console.log("Server will run in demo mode with mock data.");
    dbConnected = false;
  });

// Set up associations
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

// Permission system associations
Role.hasMany(RolePermission, { foreignKey: "roleId", as: "RolePermissions" });
RolePermission.belongsTo(Role, { foreignKey: "roleId" });
RolePermission.belongsTo(Permission, {
  foreignKey: "permissionId",
  as: "Permission",
});
Permission.hasMany(RolePermission, { foreignKey: "permissionId" });

// Sync all models
sequelize
  .sync({ alter: true })
  .then(() => console.log("All models were synchronized successfully."))
  .catch((err) => console.error("Model sync error:", err));

// Default admin credentials for demo mode
const defaultUsers = {
  admin: { password: "admin", role: "admin", name: "Admin User" },
  franchise1: { password: "pass", role: "franchise", name: "Franchise Owner" },
  subfranchise1: {
    password: "pass",
    role: "subfranchise",
    name: "Sub Franchise Owner",
  },
  manager1: { password: "pass", role: "manager", name: "Manager" },
  waiter1: { password: "pass", role: "waiter", name: "Waiter" },
  chef1: { password: "pass", role: "chef", name: "Chef" },
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Optional token verification - allows QR-based guest orders without token
const optionalToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token is invalid, but we allow the request to continue for guest orders
      console.warn("Invalid token provided, allowing as guest access");
    }
  }
  // Allow request to continue regardless of token status
  next();
};

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check default credentials first
    if (
      defaultUsers[username] &&
      defaultUsers[username].password === password
    ) {
      const user = {
        username,
        role: defaultUsers[username].role,
        name: defaultUsers[username].name,
      };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
      return res.json({
        message: "Login successful",
        token,
        user,
      });
    }

    if (!dbConnected) {
      // If not default user and no database, deny access
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = await User.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const userData = {
        username: user.username,
        role: user.role,
        name: user.name,
      };
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: "24h" });
      res.json({
        message: "Login successful",
        token,
        user: userData,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// Menu Endpoints
app.get("/api/menu", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.json(mockMenuItems);
    }
    const menuItems = await MenuItem.findAll();
    res.json(menuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.json(mockMenuItems);
  }
});

app.post("/api/menu", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const newItem = { ...req.body, id: mockMenuItems.length + 1 };
      mockMenuItems.push(newItem);
      return res.status(201).json(newItem);
    }
    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating menu item", error: err.message });
  }
});

app.put("/api/menu/:id", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const item = mockMenuItems.find((m) => m.id === parseInt(req.params.id));
      if (item) {
        Object.assign(item, req.body);
        return res.json({ message: "Menu item updated", item });
      }
      return res.status(404).json({ message: "Menu item not found" });
    }
    const { id } = req.params;
    const [updated] = await MenuItem.update(req.body, { where: { id } });
    if (updated) {
      const updatedItem = await MenuItem.findByPk(id);
      res.json({ message: "Menu item updated", item: updatedItem });
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating menu item", error: err.message });
  }
});

app.delete("/api/menu/:id", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const index = mockMenuItems.findIndex(
        (m) => m.id === parseInt(req.params.id),
      );
      if (index !== -1) {
        mockMenuItems.splice(index, 1);
        return res.json({ message: "Menu item deleted" });
      }
      return res.status(404).json({ message: "Menu item not found" });
    }
    const { id } = req.params;
    const deleted = await MenuItem.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: "Menu item deleted" });
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting menu item", error: err.message });
  }
});

// Orders Endpoints
app.get("/api/orders", async (req, res) => {
  try {
    if (!dbConnected) {
      // Return mock data in demo mode
      let filteredOrders = [...mockOrders];
      const { status, type, table_name } = req.query;

      if (status)
        filteredOrders = filteredOrders.filter((o) => o.status === status);
      if (type) filteredOrders = filteredOrders.filter((o) => o.type === type);
      if (table_name)
        filteredOrders = filteredOrders.filter(
          (o) => o.table_name === table_name,
        );

      return res.json(filteredOrders);
    }

    const { status, type, table_name } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (table_name) where.table_name = table_name;
    const orders = await Order.findAll({
      where,
      include: [{ model: OrderItem, as: "items" }],
      order: [["timestamp", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error("Error in /api/orders:", err);
    // Return mock data on error
    res.json(mockOrders);
  }
});

app.post("/api/orders", optionalToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const newOrder = {
        ...req.body,
        id: mockOrders.length + 1,
        status: req.body.status || "pending",
        timestamp: new Date(),
      };
      mockOrders.push(newOrder);
      return res.status(201).json(newOrder);
    }
    const { table_name, items, total, status, type, timestamp } = req.body;
    const order = await Order.create({
      table_name,
      total,
      status: status || "pending",
      type,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await OrderItem.create({
          orderId: order.id,
          menuItemId: item.productId || item.menuItemId || null,
          name: item.name,
          quantity: item.quantity || item.qty || 1,
          price: item.price,
        });
      }
    }
    const orderWithItems = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: "items" }],
    });
    res.status(201).json(orderWithItems);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
});

app.put("/api/orders/:id", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const order = mockOrders.find((o) => o.id === parseInt(req.params.id));
      if (order) {
        Object.assign(order, req.body);
        return res.json({ message: "Order updated", order });
      }
      return res.status(404).json({ message: "Order not found" });
    }
    const { id } = req.params;
    const { status, items } = req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (status) order.status = status;
    await order.save();
    // Optionally update items if provided
    if (items && Array.isArray(items)) {
      await OrderItem.destroy({ where: { orderId: id } });
      for (const item of items) {
        await OrderItem.create({
          orderId: id,
          menuItemId: item.productId || item.menuItemId || null,
          name: item.name,
          quantity: item.quantity || item.qty || 1,
          price: item.price,
        });
      }
    }
    const updatedOrder = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "items" }],
    });
    res.json({ message: "Order updated", order: updatedOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
});

// Request Bill Endpoint
app.put("/api/orders/:id/request-bill", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const order = mockOrders.find((o) => o.id === parseInt(req.params.id));
      if (order) {
        order.bill_requested = true;
        return res.json({ message: "Bill requested", order });
      }
      return res.status(404).json({ message: "Order not found" });
    }
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.bill_requested = true;
    await order.save();
    res.json({ message: "Bill requested", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error requesting bill", error: err.message });
  }
});

// Confirm Delivery Endpoint - Mark order as delivered and auto-generate bill
app.put("/api/orders/:id/confirm-delivery", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const order = mockOrders.find((o) => o.id === parseInt(req.params.id));
      if (order) {
        order.status = "delivered";
        order.delivered_at = new Date();
        order.bill_generated = true;
        return res.json({
          message: "Order delivered and bill generated",
          order,
        });
      }
      return res.status(404).json({ message: "Order not found" });
    }

    const { id } = req.params;
    const { tax_rate } = req.body;
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "items" }],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "ready") {
      return res.status(400).json({
        message: "Order must be in 'ready' status to confirm delivery",
      });
    }

    // Update order status
    order.status = "delivered";
    order.delivered_at = new Date();
    order.bill_generated = true;
    await order.save();

    // Auto-generate bill
    const taxRate = tax_rate || 0.05;
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const bill = await Bill.create({
      orderId: order.id,
      subtotal,
      tax,
      total,
      bill_status: "pending",
      generated_at: new Date(),
    });

    res.json({
      message: "Order delivered and bill generated",
      order,
      bill,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error confirming delivery", error: err.message });
  }
});

// Get bills for an order
app.get("/api/orders/:id/bill", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.json({ message: "No bill system in demo mode" });
    }

    const { id } = req.params;
    const bill = await Bill.findOne({ where: { orderId: id } });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found for this order" });
    }

    res.json(bill);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving bill", error: err.message });
  }
});

// Get all delivered orders (for billing page)
app.get("/api/orders/status/delivered", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      return res.json([]);
    }

    const orders = await Order.findAll({
      where: { status: "delivered" },
      include: [{ model: OrderItem, as: "items" }],
      order: [["delivered_at", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving delivered orders",
      error: err.message,
    });
  }
});

// Complete order and mark bill as paid
app.put("/api/orders/:id/complete-payment", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const order = mockOrders.find((o) => o.id === parseInt(req.params.id));
      if (order) {
        order.status = "completed";
        order.payment_method = req.body.payment_method || "cash";
        return res.json({
          message: "Payment completed and order closed",
          order,
        });
      }
      return res.status(404).json({ message: "Order not found" });
    }

    const { id } = req.params;
    const { payment_method } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "completed";
    order.payment_method = payment_method || "cash";
    await order.save();

    // Update bill status to paid
    const bill = await Bill.findOne({ where: { orderId: id } });
    if (bill) {
      bill.bill_status = "paid";
      bill.paid_at = new Date();
      bill.payment_method = payment_method || "cash";
      await bill.save();
    }

    res.json({
      message: "Payment completed and order closed",
      order,
      bill,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error completing payment", error: err.message });
  }
});

// Inventory Endpoints
app.get("/api/inventory", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.json(mockInventory);
    }
    const items = await Inventory.findAll();
    res.json(items);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.json(mockInventory);
  }
});

app.post("/api/inventory", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const newItem = { ...req.body, id: mockInventory.length + 1 };
      mockInventory.push(newItem);
      return res.status(201).json(newItem);
    }
    const newItem = await Inventory.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating inventory item", error: err.message });
  }
});

app.put("/api/inventory/:id", verifyToken, async (req, res) => {
  try {
    if (!dbConnected) {
      const item = mockInventory.find((i) => i.id === parseInt(req.params.id));
      if (item) {
        Object.assign(item, req.body);
        return res.json({ message: "Inventory item updated", item });
      }
      return res.status(404).json({ message: "Inventory item not found" });
    }
    const { id } = req.params;
    const [updated] = await Inventory.update(req.body, { where: { id } });
    if (updated) {
      const updatedItem = await Inventory.findByPk(id);
      res.json({ message: "Inventory item updated", item: updatedItem });
    } else {
      res.status(404).json({ message: "Inventory item not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating inventory item", error: err.message });
  }
});

// User Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, password, role, name } = req.body;
  try {
    if (!dbConnected) {
      return res
        .status(201)
        .json({ message: "User registered", user: { username, role, name } });
    }
    const existing = await User.findOne({ where: { username } });
    if (existing)
      return res.status(409).json({ message: "Username already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      name,
    });
    res.status(201).json({
      message: "User registered",
      user: { username: user.username, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
});

// Admin-only endpoint to create new users
app.post("/api/users", verifyToken, async (req, res) => {
  const { username, password, role, name } = req.body;
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create users" });
    }

    // Validate inputs
    if (!username || !password || !role || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role
    const validRoles = [
      "admin",
      "franchise",
      "subfranchise",
      "manager",
      "waiter",
      "chef",
    ];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!dbConnected) {
      // Demo mode - just return success
      return res.status(201).json({
        message: "User created successfully",
        user: { username, role, name },
      });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      name,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { username: user.username, role: user.role, name: user.name },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

// Get all users (admin only)
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view users" });
    }

    if (!dbConnected) {
      // Return default users in demo mode
      return res.json(
        Object.keys(defaultUsers).map((username) => ({
          username,
          role: defaultUsers[username].role,
          name: defaultUsers[username].name,
        })),
      );
    }

    const users = await User.findAll({
      attributes: ["id", "username", "role", "name"],
    });
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
});

// Update user (admin only)
app.put("/api/users/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update users" });
    }

    const { id } = req.params;
    const { username, role, name, password } = req.body;

    if (!dbConnected) {
      return res.status(400).json({ message: "Database not connected" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate role
    const validRoles = [
      "admin",
      "franchise",
      "subfranchise",
      "manager",
      "waiter",
      "chef",
    ];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ where: { username } });
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }
      user.username = username;
    }

    if (role) user.role = role;
    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
});

// Delete user (admin only)
app.delete("/api/users/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    const { id } = req.params;

    if (!dbConnected) {
      return res.status(400).json({ message: "Database not connected" });
    }

    // Prevent deleting yourself
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.username === req.user.username) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
});

// ===== PERMISSION MANAGEMENT ENDPOINTS =====

// Get all permissions
app.get("/api/permissions", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can view permissions" });
    }

    if (!dbConnected) {
      return res.json([
        { id: 1, name: "view_dashboard", category: "reporting" },
        { id: 2, name: "manage_users", category: "user_management" },
        { id: 3, name: "manage_menu", category: "menu_management" },
        { id: 4, name: "manage_orders", category: "order_management" },
        { id: 5, name: "manage_inventory", category: "inventory_management" },
        { id: 6, name: "view_billing", category: "billing" },
        { id: 7, name: "view_users", category: "user_management" },
        { id: 8, name: "create_user", category: "user_management" },
        { id: 9, name: "edit_user", category: "user_management" },
        { id: 10, name: "delete_user", category: "user_management" },
        { id: 11, name: "manage_roles", category: "user_management" },
        { id: 12, name: "view_menu", category: "menu_management" },
        { id: 13, name: "create_menu_item", category: "menu_management" },
        { id: 14, name: "edit_menu_item", category: "menu_management" },
        { id: 15, name: "delete_menu_item", category: "menu_management" },
        { id: 16, name: "view_orders", category: "order_management" },
        { id: 17, name: "create_order", category: "order_management" },
        { id: 18, name: "edit_order", category: "order_management" },
        { id: 19, name: "delete_order", category: "order_management" },
        { id: 20, name: "manage_qr_codes", category: "order_management" },
        { id: 21, name: "mark_order_preparing", category: "order_management" },
        { id: 22, name: "mark_order_ready", category: "order_management" },
        {
          id: 23,
          name: "confirm_order_delivery",
          category: "order_management",
        },
        { id: 24, name: "view_inventory", category: "inventory_management" },
        { id: 25, name: "edit_inventory", category: "inventory_management" },
        { id: 26, name: "view_billing", category: "billing" },
        { id: 27, name: "process_payments", category: "billing" },
        { id: 28, name: "view_bills", category: "billing" },
        { id: 29, name: "view_dashboard", category: "reporting" },
        { id: 30, name: "view_reports", category: "reporting" },
        { id: 31, name: "kitchen_display", category: "reporting" },
        { id: 32, name: "manage_settings", category: "settings" },
        { id: 33, name: "manage_subfranchise", category: "settings" },
      ]);
    }

    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching permissions", error: err.message });
  }
});

// Get all roles with their permissions
app.get("/api/roles", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view roles" });
    }

    if (!dbConnected) {
      return res.json([
        {
          id: 1,
          name: "admin",
          description: "Full access",
          permissions: ["*"],
        },
        {
          id: 2,
          name: "franchise",
          description: "Franchise owner access",
          permissions: [],
        },
        {
          id: 3,
          name: "waiter",
          description: "Waiter access",
          permissions: [],
        },
        { id: 4, name: "chef", description: "Chef access", permissions: [] },
      ]);
    }

    const roles = await Role.findAll({
      include: [
        {
          model: RolePermission,
          as: "RolePermissions",
          include: [
            {
              model: Permission,
              as: "Permission",
            },
          ],
        },
      ],
    });

    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.RolePermissions.map((rp) => rp.Permission.name),
    }));

    res.json(formattedRoles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching roles", error: err.message });
  }
});

// Create role (admin only)
app.post("/api/roles", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create roles" });
    }

    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    if (!dbConnected) {
      return res.status(201).json({
        message: "Role created successfully",
        role: { id: 1, name, description, permissions },
      });
    }

    const existing = await Role.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const role = await Role.create({ name, description });

    if (permissions && Array.isArray(permissions)) {
      for (const permName of permissions) {
        const permission = await Permission.findOne({
          where: { name: permName },
        });
        if (permission) {
          await RolePermission.create({
            roleId: role.id,
            permissionId: permission.id,
          });
        }
      }
    }

    res.status(201).json({
      message: "Role created successfully",
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating role", error: err.message });
  }
});

// Update role permissions (admin only)
app.put("/api/roles/:id/permissions", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update roles" });
    }

    const { id } = req.params;
    const { permissions } = req.body;

    if (!dbConnected) {
      return res.status(400).json({ message: "Database not connected" });
    }

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Remove existing permissions
    await RolePermission.destroy({ where: { roleId: id } });

    // Add new permissions
    if (permissions && Array.isArray(permissions)) {
      for (const permName of permissions) {
        const permission = await Permission.findOne({
          where: { name: permName },
        });
        if (permission) {
          await RolePermission.create({
            roleId: role.id,
            permissionId: permission.id,
          });
        }
      }
    }

    res.json({
      message: "Role permissions updated successfully",
      role: { id: role.id, name: role.name, permissions },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating role", error: err.message });
  }
});

// Create a new permission (admin only)
app.post("/api/permissions", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create permissions" });
    }

    const { name, description, category } = req.body;

    if (!dbConnected) {
      return res.status(400).json({ message: "Database not connected" });
    }

    const existing = await Permission.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Permission already exists" });
    }

    const permission = await Permission.create({
      name,
      description: description || "",
      category: category || "general",
    });

    res.status(201).json({
      message: "Permission created successfully",
      permission,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating permission", error: err.message });
  }
});

// Get user's permissions
app.get("/api/my-permissions", verifyToken, async (req, res) => {
  try {
    const username = req.user.username;

    if (req.user.role === "admin") {
      return res.json({ permissions: ["*"], role: "admin" });
    }

    if (!dbConnected) {
      return res.json({ permissions: [], role: req.user.role });
    }

    const role = await Role.findOne({ where: { name: req.user.role } });
    if (!role) {
      console.log(`❌ Role not found: ${req.user.role}`);
      return res.json({ permissions: [], role: req.user.role });
    }

    console.log(`✅ Found role: ${role.name} (ID: ${role.id})`);

    const rolePermissions = await RolePermission.findAll({
      where: { roleId: role.id },
      include: [{ model: Permission, as: "Permission" }],
    });

    console.log(`✅ Found ${rolePermissions.length} role-permission mappings`);

    const permissions = rolePermissions.map((rp) => {
      console.log(`  - Permission: ${rp.Permission.name}`);
      return rp.Permission.name;
    });

    console.log(
      `✅ Returning ${permissions.length} permissions for role ${req.user.role}`,
    );
    res.json({ permissions, role: req.user.role });
  } catch (err) {
    console.error(`❌ Error fetching permissions:`, err);
    res
      .status(500)
      .json({ message: "Error fetching permissions", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Mock backend running at http://localhost:${port}`);
});
