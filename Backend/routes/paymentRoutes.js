// routes/paymentRoutes.js
const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const {
  protect:        authMiddleware,
  authorizeRoles: roleGuard,
} = require("../middleware/authMiddleware");

const ctrl = require("../controllers/paymentController");

// ── Multer (same config as propertyRoutes) ────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload    = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const imgFields = upload.fields([
  { name: "thumbnail", maxCount: 1  },
  { name: "images",    maxCount: 10 },
]);

// ── Public: get listing fee amount ───────────────────────────────────────────
router.get("/fee-amount", ctrl.getFeeAmount);

// ── Seller: upload images + create Razorpay order ────────────────────────────
// No raw-body requirement — Razorpay verification happens in /verify, not a webhook
router.post(
  "/create-order",
  authMiddleware,
  roleGuard("seller"),
  imgFields,
  ctrl.createOrder
);

// ── Seller: verify Razorpay signature + promote draft → Property ──────────────
router.post(
  "/verify",
  authMiddleware,
  roleGuard("seller"),
  ctrl.verifyPayment
);

module.exports = router;