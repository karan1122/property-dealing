// Backend/routes/adminRoutes.js
const express = require("express");
const router  = express.Router();
const agent   = require("../controllers/agentController");

const { protect: authMiddleware, authorizeRoles: roleGuard } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/adminController");

// All admin routes require login + admin role
const adminOnly = [authMiddleware, roleGuard("admin")];

const meeting = require("../controllers/inquiryController");

// ── Dashboard stats ───────────────────────────────────────────────────────────
router.get("/stats", ...adminOnly, ctrl.getStats);

// ── User management ───────────────────────────────────────────────────────────
router.get(   "/users",              ...adminOnly, ctrl.getAllUsers);
router.patch( "/users/:id/role",     ...adminOnly, ctrl.changeUserRole);
router.patch( "/users/:id/toggle",   ...adminOnly, ctrl.toggleUserStatus);
router.delete("/users/:id",          ...adminOnly, ctrl.deleteUser);

// ── Property management ───────────────────────────────────────────────────────
router.get(   "/properties",              ...adminOnly, ctrl.getAllProperties);
router.patch( "/properties/:id/approve", ...adminOnly, ctrl.adminApproveProperty)
router.patch( "/properties/:id/reject",  ...adminOnly, ctrl.rejectProperty);
router.delete("/properties/:id",         ...adminOnly, ctrl.deleteProperty);

/* ══════════════════════════════════════════════
   AGENTS — full CRUD + assign/unassign
══════════════════════════════════════════════ */
// Create & list
router.post   ("/agents",                             agent.createAgent);
router.get    ("/agents",                             agent.getAllAgents);
 
// Single agent
router.get    ("/agents/:id",                         agent.getAgentById);
router.patch  ("/agents/:id",                         agent.updateAgent);
router.delete ("/agents/:id",                         agent.deleteAgent);
 
// Seller assignment
router.patch  ("/agents/:agentId/assign-seller",      agent.assignSeller);
router.patch  ("/agents/:agentId/unassign-seller",    agent.unassignSeller);
 
// Agent's sellers and properties
router.get    ("/agents/:id/sellers",                 agent.getAgentSellers);
router.get    ("/agents/:id/properties",              agent.getAgentProperties);
router.get("/seller/my-agent", authMiddleware, agent.getMyAgent);


router.get("/commissions", ...adminOnly, meeting.getAllCommissions);
router.patch("/commissions/:id/pay", ...adminOnly, meeting.markCommissionPaid);
module.exports = router;
