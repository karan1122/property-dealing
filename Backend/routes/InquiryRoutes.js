const express = require("express");
const router  = express.Router();
const {
  protect: authMiddleware,
  authorizeRoles: roleGuard,
} = require("../middleware/authMiddleware");
const ctrl = require("../controllers/inquiryController");
const sellerCtrl = require("../controllers/inquirymeetingController");
// Public — buyer submits inquiry
router.post("/", authMiddleware, roleGuard("buyer"), ctrl.createInquiry);


// Agent routes
router.get(  "/my",          authMiddleware, roleGuard("agent"),  ctrl.getMyInquiries);
router.get(  "/stats",       authMiddleware, roleGuard("agent"),  ctrl.getInquiryStats);
router.get(  "/commissions", authMiddleware, roleGuard("agent"),  ctrl.getMyCommissions);
router.patch("/:id/status",  authMiddleware, roleGuard("agent"),  ctrl.updateInquiryStatus);


// ADD these two seller routes (before /:id/status or they get swallowed):
router.get(   "/seller/my",       authMiddleware, roleGuard("seller"), sellerCtrl.getMyInquiries);
router.patch( "/seller/:id/read", authMiddleware, roleGuard("seller"), sellerCtrl.markInquiryRead);
// Admin routes
router.get(  "/admin/commissions",          authMiddleware, roleGuard("admin"), ctrl.getAllCommissions);
router.patch("/admin/commissions/:id/pay",  authMiddleware, roleGuard("admin"), ctrl.markCommissionPaid);

module.exports = router;