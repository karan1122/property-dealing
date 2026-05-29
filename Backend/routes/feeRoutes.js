// routes/adminFeeRoutes.js  (mount under /api/admin/fees in server.js)
// All routes require admin role.

const express = require("express");
const router  = express.Router();
const Fee     = require("../models/Fee");
const {
  protect:        authMiddleware,
  authorizeRoles: roleGuard,
} = require("../middleware/authMiddleware");

const guard = [authMiddleware, roleGuard("admin")];

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/fees
// Query params: status (paid|unpaid|waived), sellerId
// Returns fees populated with seller name/email + property title/city
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", ...guard, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.sellerId) filter.sellerId = req.query.sellerId;

    const fees = await Fee.find(filter)
      .populate("sellerId",   "name email contact")
      .populate("propertyId", "title address status")
      .sort({ createdAt: -1 });

    res.json({ success: true, fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/fees  — manually create a fee for a seller
// Body: { sellerId, propertyId?, feeType, amount, dueDate, notes? }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", ...guard, async (req, res) => {
  try {
    const { sellerId, propertyId, feeType, amount, dueDate, notes } = req.body;

    if (!sellerId || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: "sellerId, amount, and dueDate are required" });
    }

    const fee = await Fee.create({
      sellerId,
      propertyId: propertyId || null,
      feeType:    feeType || "Listing Fee",
      amount:     Number(amount),
      status:     "unpaid",
      dueDate:    new Date(dueDate),
      notes:      notes || "",
    });

    const populated = await fee.populate([
      { path: "sellerId",   select: "name email" },
      { path: "propertyId", select: "title address" },
    ]);

    res.status(201).json({ success: true, fee: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/fees/:id  — update amount or notes (unpaid only)
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/:id", ...guard, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee not found" });
    if (fee.status !== "unpaid")
      return res.status(400).json({ success: false, message: "Only unpaid fees can be edited" });

    if (req.body.amount !== undefined) fee.amount = Number(req.body.amount);
    if (req.body.notes  !== undefined) fee.notes  = req.body.notes;
    if (req.body.dueDate !== undefined) fee.dueDate = new Date(req.body.dueDate);

    await fee.save();
    res.json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/fees/:id/mark-paid
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/:id/mark-paid", ...guard, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee not found" });
    if (fee.status === "paid")
      return res.status(400).json({ success: false, message: "Fee is already paid" });

    fee.status = "paid";
    fee.paidAt = new Date();
    await fee.save();

    res.json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/fees/:id/waive
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/:id/waive", ...guard, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee not found" });
    if (fee.status === "paid")
      return res.status(400).json({ success: false, message: "Cannot waive a paid fee" });

    fee.status = "waived";
    if (req.body.reason) fee.notes = req.body.reason;
    await fee.save();

    res.json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;