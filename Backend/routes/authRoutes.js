const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // max 10 attempts per window
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute
  max: 20,
  message: { message: "Too many refresh requests." },
});

// ── Public routes ─────────────────────────────────────────────────────────────
router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);
router.post("/refresh",  refreshLimiter, refresh);
router.post("/logout",   logout);

// ── Protected routes ──────────────────────────────────────────────────────────
router.get("/me", protect, getMe);

module.exports = router;
