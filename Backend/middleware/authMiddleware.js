const { verifyAccessToken } = require("../utils/jwtUtils");

// ─────────────────────────────────────────────────────────────────────────────
// protect  —  validates Bearer access token on every protected request
// Usage:    router.get("/profile", protect, handler)
// ─────────────────────────────────────────────────────────────────────────────
const protect = (req, res, next) => {
  try {
    // Expect:  Authorization: Bearer <accessToken>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token); // throws if invalid/expired

    req.user = decoded; // { sub: userId, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "Invalid access token" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// authorizeRoles  —  role-based access control, use AFTER protect
// Usage:    router.delete("/user/:id", protect, authorizeRoles("admin"), handler)
// ─────────────────────────────────────────────────────────────────────────────
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
