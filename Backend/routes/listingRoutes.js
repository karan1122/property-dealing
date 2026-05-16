const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// ── GET /api/listings  —  any logged-in user ──────────────────────────────────
router.get("/", protect, (req, res) => {
  res.json({
    message: "Protected listings fetched",
    requestedBy: req.user.sub,
    listings: [
      { id: 1, title: "3BHK in Mumbai", price: 18000000, status: "for_sale" },
      { id: 2, title: "2BHK in Pune",   price: 9500000,  status: "for_rent" },
      { id: 3, title: "4BHK in Surat",  price: 23000000, status: "for_sale" },
    ],
  });
});

// ── POST /api/listings  —  agents and admins only ─────────────────────────────
router.post("/", protect, authorizeRoles("agent", "admin"), (req, res) => {
  res.status(201).json({ message: "Listing created", listing: req.body });
});

// ── DELETE /api/listings/:id  —  admin only ───────────────────────────────────
router.delete("/:id", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `Listing ${req.params.id} deleted` });
});

module.exports = router;
