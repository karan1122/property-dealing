// Backend/routes/adminRoutes.js
const express = require("express");
const router  = express.Router();

const { protect: authMiddleware, authorizeRoles: roleGuard } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/adminController");

// All admin routes require login + admin role
const adminOnly = [authMiddleware, roleGuard("admin")];

// ── Dashboard stats ───────────────────────────────────────────────────────────
router.get("/stats", ...adminOnly, ctrl.getStats);

// ── User management ───────────────────────────────────────────────────────────
router.get(   "/users",              ...adminOnly, ctrl.getAllUsers);
router.patch( "/users/:id/role",     ...adminOnly, ctrl.changeUserRole);
router.patch( "/users/:id/toggle",   ...adminOnly, ctrl.toggleUserStatus);
router.delete("/users/:id",          ...adminOnly, ctrl.deleteUser);

// ── Property management ───────────────────────────────────────────────────────
router.get(   "/properties",              ...adminOnly, ctrl.getAllProperties);
router.patch( "/properties/:id/approve", ...adminOnly, ctrl.approveProperty);
router.patch( "/properties/:id/reject",  ...adminOnly, ctrl.rejectProperty);
router.delete("/properties/:id",         ...adminOnly, ctrl.deleteProperty);

module.exports = router;