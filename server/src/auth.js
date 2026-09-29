import jwt from "jsonwebtoken";
import db from "./db.js";

const secret =
  process.env.JWT_SECRET ||
  "development-secret-change-me";

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    },
    secret,
    {
      expiresIn: "7d"
    }
  );
}

export function requireAuth(req, res, next) {
  const header =
    req.headers.authorization || "";

  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}

export function requireAdmin(
  req,
  res,
  next
) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message:
        "Administrator access required."
    });
  }

  next();
}

export function getUser(id) {
  return db
    .prepare(
      "SELECT id,name,email,role,created_at FROM users WHERE id=?"
    )
    .get(id);
}