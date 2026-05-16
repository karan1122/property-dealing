const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_OPTIONS,
} = require("../utils/jwtUtils");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, contact, role } = req.body;

    const errors = {};
    if (!name || name.trim().length < 2)          errors.name    = "Name must be at least 2 characters";
    if (!email || !validator.isEmail(email))       errors.email   = "Enter a valid email address";
    if (!contact || !/^[0-9]{10}$/.test(contact)) errors.contact = "Enter a valid 10-digit phone number";
    if (!password || password.length < 6)         errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length > 0)
      return res.status(422).json({ message: "Validation failed", errors });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(409).json({ message: "Email is already registered" });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      contact: contact.trim(),
      password,
      role: role || "buyer",
    });

    const accessToken  = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    const hashedRT     = await bcrypt.hash(refreshToken, 10);

    await User.findByIdAndUpdate(user._id, { $set: { refreshTokens: [hashedRT] } });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Account created successfully",
      accessToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error("register error:", err.message);
    return res.status(500).json({ message: err.message || "Server error. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select("+password +refreshTokens");

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account has been deactivated" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const accessToken  = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    const hashedRT     = await bcrypt.hash(refreshToken, 10);

    const updatedTokens = [...(user.refreshTokens || []), hashedRT].slice(-5);

    await User.findByIdAndUpdate(user._id, {
      $set: { refreshTokens: updatedTokens, lastLogin: new Date() }
    });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error("login error:", err.message);
    return res.status(500).json({ message: err.message || "Server error. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/refresh  ← FIXED: findByIdAndUpdate instead of user.save()
// ─────────────────────────────────────────────────────────────────────────────
const refresh = async (req, res) => {
  try {
    const incomingRT = req.cookies?.refreshToken;

    if (!incomingRT)
      return res.status(401).json({ message: "No refresh token provided" });

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRT);
    } catch {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.sub).select("+refreshTokens");
    if (!user)
      return res.status(403).json({ message: "User not found" });

    // ── Find matching stored token ─────────────────────────────────────────
    let matchIndex = -1;
    for (let i = 0; i < user.refreshTokens.length; i++) {
      const isMatch = await bcrypt.compare(incomingRT, user.refreshTokens[i]);
      if (isMatch) { matchIndex = i; break; }
    }

    if (matchIndex === -1) {
      // Reuse detected — clear all tokens
      await User.findByIdAndUpdate(user._id, { $set: { refreshTokens: [] } });
      res.clearCookie("refreshToken", { path: "/" });
      return res.status(403).json({ message: "Refresh token reuse detected. Please login again." });
    }

    // ── Rotate tokens ─────────────────────────────────────────────────────
    const newAccessToken  = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);
    const hashedNewRT     = await bcrypt.hash(newRefreshToken, 10);

    // Remove old token, push new one
    const updatedTokens = user.refreshTokens.filter((_, i) => i !== matchIndex);
    updatedTokens.push(hashedNewRT);

    // findByIdAndUpdate avoids Mongoose __v version key conflicts
    await User.findByIdAndUpdate(
      user._id,
      { $set: { refreshTokens: updatedTokens } }
    );

    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      accessToken: newAccessToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error("refresh error:", err.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    const incomingRT = req.cookies?.refreshToken;

    if (incomingRT) {
      try {
        const decoded = verifyRefreshToken(incomingRT);
        const user = await User.findById(decoded.sub).select("+refreshTokens");

        if (user) {
          const filtered = [];
          for (const stored of user.refreshTokens) {
            const match = await bcrypt.compare(incomingRT, stored);
            if (!match) filtered.push(stored);
          }
          await User.findByIdAndUpdate(user._id, { $set: { refreshTokens: filtered } });
        }
      } catch {
        // invalid token — still clear cookie
      }
    }

    res.clearCookie("refreshToken", { path: "/" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (Protected)
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: user.toPublicJSON() });
  } catch (err) {
    console.error("getMe error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, refresh, logout, getMe };