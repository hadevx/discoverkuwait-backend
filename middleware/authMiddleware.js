const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/userModel");

const protectUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }
    req.role = decoded.role; // attach role
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});
const protectAdmin = (req, res, next) => {
  if (req.user && req.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin access only");
  }
};

const protectUnblocked = (req, res, next) => {
  if (req.user?.isBlocked) {
    res.status(403);
    throw new Error("Your account has been blocked");
  }
  next();
};

// Sets req.user if a valid JWT is present; skips silently if not.
const optionalAuth = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
  } catch {}
  next();
};

module.exports = { protectUser, protectAdmin, optionalAuth, protectUnblocked };
