// Backend/controllers/adminController.js
const User     = require("../models/User");
const Property = require("../models/Property");

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/stats  —  site-wide numbers for dashboard
// ─────────────────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers, totalSellers, totalBuyers,
      totalProperties, pendingProperties, approvedProperties, soldProperties,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "buyer" }),
      Property.countDocuments({ isActive: true }),
      Property.countDocuments({ isApprovedByCompany: false, isActive: true }),
      Property.countDocuments({ isApprovedByCompany: true, isActive: true }),
      Property.countDocuments({ status: "Sold" }),
    ]);

    res.json({
      users:      { total: totalUsers, sellers: totalSellers, buyers: totalBuyers },
      properties: { total: totalProperties, pending: pendingProperties, approved: approvedProperties, sold: soldProperties },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/users  —  all users with filters
// ─────────────────────────────────────────────────────────────────────────────
// In adminController.js — getAllUsers
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (search) filter.$or = [
      { name:  { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

    const users = await User.find(filter)
      .select("-password")
      .populate("assignedAgent", "name email contact") // ← ADD THIS
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/users/:id/role  —  change a user's role
// ─────────────────────────────────────────────────────────────────────────────
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["buyer", "seller", "agent", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const user = await User.findByIdAndUpdate(
      req.params.id, { role }, { new: true }
    ).select("-refreshTokens");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/users/:id/toggle  —  activate / deactivate account
// ─────────────────────────────────────────────────────────────────────────────
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot deactivate an admin" });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/users/:id  —  permanently delete user
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin" });

    await User.findByIdAndDelete(req.params.id);
    // Also soft-delete their properties
    await Property.updateMany({ userId: req.params.id }, { isActive: false });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/properties  —  ALL properties (pending + approved)
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllProperties = async (req, res) => {
  try {
    const { approved, agentVerdict, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (approved !== undefined) filter.isApprovedByCompany = approved === "true";
    if (agentVerdict) filter.agentVerificationStatus = agentVerdict;  // ← add this

    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("userId", "name email contact role")
        .populate("verifiedByAgent", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);
    res.json({ properties, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/properties/:id/approve
// ─────────────────────────────────────────────────────────────────────────────
// NEW
exports.adminApproveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: "Not found" });

    // Block approval if agent hasn't approved yet
    if (property.agentVerdict !== "approved")
      return res.status(400).json({
        success: false,
        message: "Cannot approve — agent verification is still pending",
      });

    property.isApprovedByCompany = true;
    property.status = "Available";
    await property.save();

    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/properties/:id/reject
// ─────────────────────────────────────────────────────────────────────────────
exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
    // In adminController rejectProperty:
{ isApprovedByCompany: false, status: "Rejected", isActive: false },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property rejected", property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/properties/:id  —  hard delete
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};